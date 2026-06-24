import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { PaymentsService } from '../payments/payments.service'
import { Decimal } from '@prisma/client/runtime/library'

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
    }
  }

  async createPixDeposit(userId: string, amount: number) {
    if (amount < 10) throw new BadRequestException('Valor mínimo de depósito: R$ 10,00')
    if (amount > 50000) throw new BadRequestException('Valor máximo por depósito: R$ 50.000,00')

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')

    // Verifica limite mensal R$10.000
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthlyTotal = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        createdAt: { gte: monthStart },
      },
      _sum: { amount: true },
    })

    const currentMonthly = Number(monthlyTotal._sum.amount ?? 0)
    if (currentMonthly + amount > 10000) {
      throw new BadRequestException(`Limite mensal de R$ 10.000 atingido. Disponível: R$ ${(10000 - currentMonthly).toFixed(2)}`)
    }

    const pix = await this.payments.createPixCharge({ amount, userId, userCpf: user.cpf })

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        status: 'PENDING',
        amount,
        balanceBefore: Number(user.wallet?.balance ?? 0),
        balanceAfter: Number(user.wallet?.balance ?? 0),
        paymentMethod: 'PIX',
        externalId: pix.txid,
        description: 'Depósito via PIX',
        metadata: { pixKey: pix.pixCopiaECola, expiresAt: pix.calendario?.expiracao },
      },
    })

    return {
      transactionId: transaction.id,
      txid: pix.txid,
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

    const newBalance = Number(wallet.balance) + amount

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balance: { increment: amount },
          totalDeposited: { increment: amount },
        },
      }),
      this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          balanceAfter: newBalance,
          processedAt: new Date(),
        },
      }),
    ])
  }

  async createWithdrawal(userId: string, amount: number, pixKey: string, pixKeyType: string) {
    if (amount < 20) throw new BadRequestException('Valor mínimo de saque: R$ 20,00')
    if (amount > 50000) throw new BadRequestException('Valor máximo por saque: R$ 50.000,00')

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    if (user.kycStatus !== 'APPROVED') throw new BadRequestException('KYC não aprovado. Verifique sua identidade antes de sacar.')

    const balance = Number(user.wallet?.balance ?? 0)
    if (balance < amount) throw new BadRequestException('Saldo insuficiente')

    if (pixKeyType === 'CPF') {
      const pixCpf = pixKey.replace(/\D/g, '')
      if (pixCpf !== user.cpf) throw new BadRequestException('Saque permitido apenas para chave PIX do seu próprio CPF')
    }

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
    if (!wallet || Number(wallet.balance) < amount) {
      throw new BadRequestException('Saldo insuficiente')
    }
    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount }, totalWagered: { increment: amount } },
    })
  }

  async creditForWin(userId: string, amount: number): Promise<void> {
    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount }, totalWon: { increment: amount } },
    })
  }
}
