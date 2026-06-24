import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalUsers,
      newUsersToday,
      depositToday,
      withdrawalToday,
      depositMonth,
      pendingWithdrawals,
      totalBets,
      totalWins,
      kycPending,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.transaction.aggregate({ where: { type: 'DEPOSIT', status: 'COMPLETED', createdAt: { gte: todayStart } }, _sum: { amount: true }, _count: true }),
      this.prisma.transaction.aggregate({ where: { type: 'WITHDRAWAL', status: { in: ['COMPLETED', 'PROCESSING'] }, createdAt: { gte: todayStart } }, _sum: { amount: true }, _count: true }),
      this.prisma.transaction.aggregate({ where: { type: 'DEPOSIT', status: 'COMPLETED', createdAt: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.transaction.count({ where: { type: 'WITHDRAWAL', status: 'PROCESSING' } }),
      this.prisma.bet.aggregate({ _sum: { betAmount: true }, _count: true }),
      this.prisma.bet.aggregate({ where: { status: 'WON' }, _sum: { winAmount: true } }),
      this.prisma.kycDocument.count({ where: { status: 'PENDING' } }),
    ])

    const betsTotal = Number(totalBets._sum.betAmount ?? 0)
    const winsTotal = Number(totalWins._sum.winAmount ?? 0)
    const ggr = betsTotal - winsTotal

    return {
      users: { total: totalUsers, today: newUsersToday },
      financial: {
        depositToday: Number(depositToday._sum.amount ?? 0),
        depositCountToday: depositToday._count,
        withdrawalToday: Number(withdrawalToday._sum.amount ?? 0),
        depositMonth: Number(depositMonth._sum.amount ?? 0),
        pendingWithdrawals,
        ggr,
        ggrRate: betsTotal > 0 ? ((ggr / betsTotal) * 100).toFixed(2) : '0',
      },
      gaming: { totalBets: totalBets._count, totalWagered: betsTotal, totalWon: winsTotal },
      kyc: { pending: kycPending },
    }
  }

  async getUsers(page = 1, limit = 20, search?: string, status?: string) {
    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search.replace(/\D/g, '') } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) where.status = status

    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { wallet: { select: { balance: true, totalDeposited: true } } },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      data: users.map(({ passwordHash, twoFactorSecret, ...u }) => ({
        ...u,
        balance: Number(u.wallet?.balance ?? 0),
        totalDeposited: Number(u.wallet?.totalDeposited ?? 0),
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  }

  async updateUserStatus(userId: string, status: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { status: status as any } })
  }

  async getPendingWithdrawals(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { type: 'WITHDRAWAL', status: 'PROCESSING' },
        skip, take: limit,
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { username: true, email: true, cpf: true } } },
      }),
      this.prisma.transaction.count({ where: { type: 'WITHDRAWAL', status: 'PROCESSING' } }),
    ])

    return {
      data: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  }

  async approveWithdrawal(transactionId: string) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'COMPLETED', processedAt: new Date() },
    })
  }

  async rejectWithdrawal(transactionId: string, reason: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } })
    if (!tx) return

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId: tx.userId },
        data: { balance: { increment: Number(tx.amount) } },
      }),
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'CANCELLED', metadata: { rejectionReason: reason } },
      }),
    ])
  }

  async approveKyc(kycId: string) {
    const doc = await this.prisma.kycDocument.update({
      where: { id: kycId },
      data: { status: 'APPROVED', reviewedAt: new Date() },
    })
    await this.prisma.user.update({ where: { id: doc.userId }, data: { kycStatus: 'APPROVED' } })
    return doc
  }

  async rejectKyc(kycId: string, reason: string) {
    const doc = await this.prisma.kycDocument.update({
      where: { id: kycId },
      data: { status: 'REJECTED', rejectionReason: reason, reviewedAt: new Date() },
    })
    await this.prisma.user.update({ where: { id: doc.userId }, data: { kycStatus: 'REJECTED' } })
    return doc
  }

  async getKycPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [docs, total] = await Promise.all([
      this.prisma.kycDocument.findMany({
        where: { status: 'PENDING' }, skip, take: limit,
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { username: true, email: true, fullName: true, cpf: true } } },
      }),
      this.prisma.kycDocument.count({ where: { status: 'PENDING' } }),
    ])
    return { data: docs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  }

  async toggleGame(gameId: string, isActive: boolean) {
    return this.prisma.game.update({ where: { id: gameId }, data: { isActive } })
  }

  async getGames(page = 1, limit = 30, search?: string) {
    const where: any = {}
    if (search) where.name = { contains: search, mode: 'insensitive' }
    const skip = (page - 1) * limit
    const [games, total] = await Promise.all([
      this.prisma.game.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.game.count({ where }),
    ])
    return { data: games, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  }
}
