import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class BonusService {
  constructor(private prisma: PrismaService) {}

  async getActiveBonuses(userId: string) {
    return this.prisma.userBonus.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { bonus: true },
      orderBy: { activatedAt: 'desc' },
    })
  }

  async claimBonus(userId: string, bonusId: string) {
    const bonus = await this.prisma.bonus.findFirst({
      where: { isActive: true },
    })
    if (!bonus) throw new NotFoundException('Bônus não encontrado ou inativo')

    const existing = await this.prisma.userBonus.findFirst({
      where: { userId, bonusId: bonus.id, status: 'ACTIVE' },
    })
    if (existing) throw new BadRequestException('Você já tem este bônus ativo')

    if (bonus.type === 'WELCOME') {
      const alreadyClaimed = await this.prisma.userBonus.findFirst({
        where: { userId, bonus: { type: 'WELCOME' } },
      })
      if (alreadyClaimed) throw new BadRequestException('Bônus de boas-vindas já utilizado')
    }

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } })
    if (!wallet) throw new NotFoundException('Carteira não encontrada')

    const bonusAmount = Math.min(
      bonus.amount ? Number(bonus.amount) : Number(wallet.balance) * (bonus.percentage || 1),
      Number(bonus.maxAmount || 99999)
    )

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (bonus.expiresInDays || 7))

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { bonusBalance: { increment: bonusAmount } },
      }),
      this.prisma.userBonus.create({
        data: {
          userId,
          bonusId: bonus.id,
          bonusAmount,
          remainingRollover: bonusAmount * bonus.rolloverMultiplier,
          expiresAt,
          status: 'ACTIVE',
        },
      }),
    ])

    return { message: 'Bônus resgatado com sucesso!', amount: bonusAmount }
  }

  async processRollover(userId: string, wageredAmount: number) {
    const activeBonus = await this.prisma.userBonus.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { activatedAt: 'asc' },
    })
    if (!activeBonus) return

    const newRemaining = Math.max(0, Number(activeBonus.remainingRollover) - wageredAmount)

    if (newRemaining === 0) {
      await this.prisma.userBonus.update({
        where: { id: activeBonus.id },
        data: { remainingRollover: 0, status: 'COMPLETED', completedAt: new Date() },
      })
    } else {
      await this.prisma.userBonus.update({
        where: { id: activeBonus.id },
        data: { remainingRollover: newRemaining },
      })
    }
  }

  async applyWelcomeBonus(userId: string, depositAmount: number) {
    const welcomeBonus = await this.prisma.bonus.findFirst({
      where: { type: 'WELCOME', isActive: true },
    })
    if (!welcomeBonus) return

    const alreadyClaimed = await this.prisma.userBonus.findFirst({
      where: { userId, bonus: { type: 'WELCOME' } },
    })
    if (alreadyClaimed) return

    if (depositAmount < Number(welcomeBonus.minDeposit)) return

    const bonusAmount = Math.min(
      depositAmount * (welcomeBonus.percentage || 1),
      Number(welcomeBonus.maxAmount || 500)
    )
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + welcomeBonus.expiresInDays)

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { bonusBalance: { increment: bonusAmount } },
      }),
      this.prisma.userBonus.create({
        data: {
          userId,
          bonusId: welcomeBonus.id,
          bonusAmount,
          remainingRollover: bonusAmount * welcomeBonus.rolloverMultiplier,
          expiresAt,
          status: 'ACTIVE',
        },
      }),
    ])
  }
}
