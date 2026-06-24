import { Injectable, NotFoundException, BadRequestException, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../common/prisma/prisma.service'
import { WalletService } from '../wallet/wallet.service'
import axios from 'axios'
import * as crypto from 'crypto'

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name)

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private wallet: WalletService,
  ) {}

  async getLobby(category?: string, provider?: string, search?: string, page = 1, limit = 48) {
    const where: any = { isActive: true }
    if (category) where.category = category.toUpperCase()
    if (provider) where.provider = { contains: provider, mode: 'insensitive' }
    if (search) where.name = { contains: search, mode: 'insensitive' }

    const skip = (page - 1) * limit
    const [games, total] = await Promise.all([
      this.prisma.game.findMany({ where, skip, take: limit, orderBy: [{ isFeatured: 'desc' }, { isNew: 'desc' }] }),
      this.prisma.game.count({ where }),
    ])

    return { data: games, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  }

  async launchGame(userId: string, gameSlug: string, isDemo = false) {
    const game = await this.prisma.game.findUnique({ where: { slug: gameSlug } })
    if (!game || !game.isActive) throw new NotFoundException('Jogo não encontrado')

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('Usuário não encontrado')

    if (!isDemo && user.kycStatus !== 'APPROVED') {
      throw new BadRequestException('Verifique sua identidade (KYC) para jogar com dinheiro real')
    }

    const sessionToken = crypto.randomUUID()
    await this.prisma.gameSession.create({
      data: { userId, gameId: game.id, sessionToken, isDemo },
    })

    const launchUrl = await this.getHub88LaunchUrl({
      gameId: game.externalId,
      userId,
      sessionToken,
      currency: 'BRL',
      language: 'pt',
      isDemo,
    })

    return { launchUrl, sessionToken }
  }

  // ============================================
  // SEAMLESS WALLET CALLBACKS (Hub88)
  // ============================================

  async handleBalance(payload: Hub88BalancePayload) {
    this.verifyHub88Signature(payload)
    const wallet = await this.prisma.wallet.findFirst({
      where: { user: { id: payload.user_id } },
    })
    if (!wallet) throw new NotFoundException('Carteira não encontrada')

    return {
      status: 'OK',
      balance: Math.round(Number(wallet.balance) * 100),
      currency: 'BRL',
    }
  }

  async handleDebit(payload: Hub88TransactionPayload) {
    this.verifyHub88Signature(payload)
    const amount = payload.amount / 100

    const existing = await this.prisma.bet.findFirst({
      where: { roundId: payload.round_id, status: 'ACTIVE' },
    })
    if (existing) return this.buildTransactionResponse(existing.id, payload.user_id)

    const game = await this.prisma.game.findFirst({ where: { externalId: payload.game_id } })
    if (!game) throw new NotFoundException('Jogo não encontrado')

    await this.wallet.debitForBet(payload.user_id, amount, payload.round_id)

    const wallet = await this.prisma.wallet.findFirst({ where: { userId: payload.user_id } })
    const bet = await this.prisma.bet.create({
      data: {
        userId: payload.user_id,
        gameId: game.id,
        roundId: payload.round_id,
        betAmount: amount,
        status: 'ACTIVE',
        currency: 'BRL',
        metadata: { externalTransactionId: payload.transaction_id },
      },
    })

    return {
      status: 'OK',
      transaction_id: bet.id,
      balance: Math.round(Number(wallet?.balance) * 100),
      currency: 'BRL',
    }
  }

  async handleCredit(payload: Hub88TransactionPayload) {
    this.verifyHub88Signature(payload)
    const amount = payload.amount / 100

    const bet = await this.prisma.bet.findFirst({ where: { roundId: payload.round_id } })
    if (!bet) throw new NotFoundException('Aposta não encontrada')

    if (amount > 0) {
      await this.wallet.creditForWin(payload.user_id, amount)
    }

    const updatedBet = await this.prisma.bet.update({
      where: { id: bet.id },
      data: { winAmount: amount, status: amount > 0 ? 'WON' : 'LOST' },
    })

    const wallet = await this.prisma.wallet.findFirst({ where: { userId: payload.user_id } })

    return {
      status: 'OK',
      transaction_id: updatedBet.id,
      balance: Math.round(Number(wallet?.balance) * 100),
      currency: 'BRL',
    }
  }

  async handleRollback(payload: Hub88RollbackPayload) {
    this.verifyHub88Signature(payload)

    const bet = await this.prisma.bet.findFirst({ where: { roundId: payload.round_id } })
    if (!bet || bet.status === 'CANCELLED') return { status: 'OK' }

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId: payload.user_id },
        data: { balance: { increment: Number(bet.betAmount) } },
      }),
      this.prisma.bet.update({
        where: { id: bet.id },
        data: { status: 'CANCELLED' },
      }),
    ])

    const wallet = await this.prisma.wallet.findFirst({ where: { userId: payload.user_id } })
    return { status: 'OK', balance: Math.round(Number(wallet?.balance) * 100), currency: 'BRL' }
  }

  private async getHub88LaunchUrl(params: any): Promise<string> {
    const { data } = await axios.post(
      `${this.config.get('HUB88_API_URL')}/user/session`,
      {
        operator_id: this.config.get('HUB88_OPERATOR_ID'),
        user_id: params.userId,
        game_id: params.gameId,
        currency: params.currency,
        language: params.language,
        session_token: params.sessionToken,
        return_url: `${this.config.get('APP_URL')}/lobby`,
        demo: params.isDemo,
      },
      {
        headers: {
          'X-Hub88-Secret': this.config.get('HUB88_SECRET_KEY'),
          'Content-Type': 'application/json',
        },
      }
    )
    return data.url
  }

  private verifyHub88Signature(payload: any) {
    const secret = this.config.get('HUB88_SECRET_KEY', '')
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')

    if (payload.signature && payload.signature !== signature) {
      throw new UnauthorizedException('Assinatura inválida')
    }
  }

  private buildTransactionResponse(transactionId: string, userId: string) {
    return { status: 'OK', transaction_id: transactionId }
  }
}

interface Hub88BalancePayload {
  user_id: string
  currency: string
  signature?: string
}

interface Hub88TransactionPayload {
  user_id: string
  game_id: string
  round_id: string
  transaction_id: string
  amount: number
  currency: string
  signature?: string
}

interface Hub88RollbackPayload {
  user_id: string
  round_id: string
  transaction_id: string
  signature?: string
}
