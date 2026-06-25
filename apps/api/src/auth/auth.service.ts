import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../common/prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

const WELCOME_BONUS_AMOUNT = 40
const WELCOME_BONUS_ROLLOVER = 150

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const phoneClean = dto.phone.replace(/\D/g, '')

    const exists = await this.prisma.user.findFirst({
      where: { phone: phoneClean },
    })
    if (exists) throw new ConflictException('Telefone já cadastrado')

    let referrerId: string | undefined
    if (dto.referralCode) {
      const referrer = await this.prisma.user.findUnique({ where: { referralCode: dto.referralCode } })
      if (referrer) referrerId = referrer.id
    }

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const username = 'user' + phoneClean.slice(-6) + Math.floor(Math.random() * 999)

    const user = await this.prisma.user.create({
      data: {
        phone: phoneClean,
        username,
        passwordHash,
        fullName: dto.fullName,
        referredById: referrerId,
        wallet: { create: { balance: 0, bonusBalance: WELCOME_BONUS_AMOUNT, rolloverRequired: WELCOME_BONUS_ROLLOVER, rolloverCompleted: 0 } },
      },
      include: { wallet: true },
    })

    if (referrerId) {
      await this.prisma.referral.create({
        data: { referrerId, referredId: user.id },
      })
    }

    const tokens = await this.generateTokens(user.id, user.phone)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    return {
      user: this.sanitizeUser(user),
      wallet: { balance: Number(user.wallet?.balance ?? 0), bonusBalance: Number(user.wallet?.bonusBalance ?? 0) },
      ...tokens,
    }
  }

  async login(dto: LoginDto) {
    const phoneClean = dto.phone.replace(/\D/g, '')

    const user = await this.prisma.user.findFirst({
      where: { phone: phoneClean },
      include: { wallet: true },
    })

    if (!user) throw new UnauthorizedException('Telefone ou senha inválidos')
    if (user.status === 'BANNED') throw new UnauthorizedException('Conta banida')
    if (user.status === 'SELF_EXCLUDED') throw new UnauthorizedException('Conta autoexcluída')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Telefone ou senha inválidos')

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: dto.ip },
    })

    const tokens = await this.generateTokens(user.id, user.phone)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    return {
      user: this.sanitizeUser(user),
      wallet: { balance: Number(user.wallet?.balance ?? 0), bonusBalance: Number(user.wallet?.bonusBalance ?? 0) },
      ...tokens,
    }
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Sessão expirada')
    }

    const tokens = await this.generateTokens(session.userId, session.user.phone)
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    })

    return tokens
  }

  async logout(userId: string, refreshToken: string) {
    await this.prisma.userSession.deleteMany({
      where: { userId, refreshToken },
    })
  }

  private async generateTokens(userId: string, phone: string) {
    const payload = { sub: userId, phone }
    const accessToken = this.jwt.sign(payload)
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    })
    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.userSession.create({
      data: {
        userId,
        refreshToken,
        ipAddress: '',
        userAgent: '',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
  }

  private sanitizeUser(user: any) {
    const { passwordHash, twoFactorSecret, ...safe } = user
    return safe
  }
}
