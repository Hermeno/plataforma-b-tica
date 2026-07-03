import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { PaymentsService } from '../payments/payments.service'

const DEPOSIT_BONUS_PERCENT = 0.10
const REFERRAL_BONUS = 50
const REFERRAL_MIN_DEPOSIT = 100
const REFERRAL_MIN_WAGERED = 300

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private payments: PaymentsService,
  ) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } })
    if (!wallet) throw new NotFoundException('Carteira não encontrada')
    return {
      balance: Number(wallet.balance),
      bonusBalance: Number(wallet.bonusBalance),
      totalDeposited: Number(wallet.totalDeposited),
      totalWithdrawn: Number(wallet.totalWithdrawn),
      rolloverRequired: Number(wallet.rolloverRequired),
      rolloverCompleted: Number(wallet.rolloverCompleted),
    }
  }

  async createPixDeposit(userId: string, amount: number) {
    if (amount < 10) throw new BadRequestException('Valor mínimo de depósito: R$ 10,00')
    if (amount > 1000) throw new BadRequestException('Valor máximo por depósito: R$ 1.000,00')

    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { wallet: true } })
    if (!user) throw new NotFoundException('Usuário não encontrado')

    const pix = await this.payments.createPixCharge({
      amount,
      userId,
      userName: user.fullName,
    })

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        status: 'PENDING',
        amount,
        balanceBefore: Number(user.wallet?.balance ?? 0),
        balanceAfter: Number(user.wallet?.balance ?? 0),
        paymentMethod: 'PIX',
        externalId: pix.transactionId,
        description: 'Depósito via PIX',
        metadata: { pixKey: pix.pixCopiaECola },
      },
    })

    return {
      transactionId: pix.transactionId,
      txid: pix.transactionId,
      pixCopiaECola: pix.pixCopiaECola,
      qrCode: pix.qrCode,
      expiresIn: 3600,
      amount,
    }
  }

  async confirmDeposit(txid: string, amount: number) {
    const transaction = await this.prisma.transaction.findUnique({ where: { externalId: txid } })
    if (!transaction || transaction.status !== 'PENDING') return

    const wallet = await this.prisma.wallet.findUnique({ where: { userId: transaction.userId } })
    if (!wallet) return

    const bonusAmount = Math.round(amount * DEPOSIT_BONUS_PERCENT * 100) / 100
    const newBalance = Number(wallet.balance) + amount
    const newRollover = Number(wallet.rolloverRequired) + amount

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balance: { increment: amount },
          bonusBalance: { increment: bonusAmount },
          totalDeposited: { increment: amount },
          rolloverRequired: { increment: amount },
        },
      }),
      this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED', balanceAfter: newBalance, processedAt: new Date() },
      }),
    ])

    await this.checkAndPayReferralBonus(transaction.userId)
  }

  async createWithdrawal(userId: string, amount: number, pixKey: string, pixKeyType: string) {
    if (amount < 20) throw new BadRequestException('Valor mínimo de saque: R$ 20,00')

    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { wallet: true } })
    if (!user) throw new NotFoundException('Usuário não encontrado')

    const wallet = user.wallet!
    const balance = Number(wallet.balance)
    const rolloverRequired = Number(wallet.rolloverRequired)
    const rolloverCompleted = Number(wallet.rolloverCompleted)

    if (rolloverCompleted < rolloverRequired) {
      const remaining = rolloverRequired - rolloverCompleted
      throw new BadRequestException(`Complete o rollover antes de sacar. Faltam R$ ${remaining.toFixed(2)} em apostas.`)
    }

    if (balance < amount) throw new BadRequestException('Saldo insuficiente')

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'WITHDRAWAL',
          status: 'PROCESSING',
          amount,
          balanceBefore: balance,
          balanceAfter: balance - amount,
          paymentMethod: 'PIX',
          pixKey,
          description: 'Saque via PIX',
          metadata: { pixKeyType },
        },
      }),
    ])

    return { message: 'Saque solicitado. Processamento em até 24 horas.', amount }
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, type: true, status: true, amount: true,
          balanceBefore: true, balanceAfter: true,
          paymentMethod: true, description: true,
          createdAt: true, processedAt: true,
        },
      }),
      this.prisma.transaction.count({ where: { userId } }),
    ])

    return {
      data: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  }

  async debitForBet(userId: string, amount: number, roundId: string): Promise<void> {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } })
    if (!wallet || Number(wallet.balance) < amount) throw new BadRequestException('Saldo insuficiente')

    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
        totalWagered: { increment: amount },
        rolloverCompleted: { increment: amount },
      },
    })

    await this.checkAndPayReferralBonus(userId)
  }

  async creditForWin(userId: string, amount: number): Promise<void> {
    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount }, totalWon: { increment: amount } },
    })
  }

  private async checkAndPayReferralBonus(userId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { referredId: userId },
    })
    if (!referral || referral.status !== 'PENDING') return

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } })
    if (!wallet) return

    const totalDeposited = Number(wallet.totalDeposited)
    const totalWagered = Number(wallet.totalWagered)

    if (totalDeposited >= REFERRAL_MIN_DEPOSIT && totalWagered >= REFERRAL_MIN_WAGERED) {
      await this.prisma.$transaction([
        this.prisma.referral.update({
          where: { referredId: userId },
          data: { status: 'PAID', bonusPaidAt: new Date(), depositAmount: totalDeposited, wageredAmount: totalWagered },
        }),
        this.prisma.wallet.update({
          where: { userId: referral.referrerId },
          data: { balance: { increment: REFERRAL_BONUS } },
        }),
        this.prisma.transaction.create({
          data: {
            userId: referral.referrerId,
            type: 'BONUS',
            status: 'COMPLETED',
            amount: REFERRAL_BONUS,
            balanceBefore: 0,
            balanceAfter: REFERRAL_BONUS,
            description: `Bônus de indicação — R$${REFERRAL_BONUS}`,
          },
        }),
      ])
    }
  }
}
