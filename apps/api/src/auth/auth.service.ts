import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../common/prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const cpfClean = dto.cpf.replace(/\D/g, '')

    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { cpf: cpfClean }, { phone: dto.phone }] },
    })
    if (exists) {
      if (exists.email === dto.email) throw new ConflictException('E-mail já cadastrado')
      if (exists.cpf === cpfClean) throw new ConflictException('CPF já cadastrado')
      throw new ConflictException('Telefone já cadastrado')
    }

    const birthDate = new Date(dto.birthDate)
    const age = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    if (age < 18) throw new BadRequestException('Você precisa ter 18 anos ou mais')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const username = dto.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 9999)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        cpf: cpfClean,
        phone: dto.phone,
        username,
        passwordHash,
        fullName: dto.fullName,
        birthDate,
        referredById: dto.referralCode ? await this.findUserIdByReferral(dto.referralCode) : undefined,
        wallet: { create: { balance: 0, bonusBalance: 0 } },
      },
      include: { wallet: true },
    })

    const tokens = await this.generateTokens(user.id, user.email)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    return {
      user: this.sanitizeUser(user),
      wallet: { balance: Number(user.wallet?.balance ?? 0) },
      ...tokens,
    }
  }

  async login(dto: LoginDto) {
    const isEmail = dto.login.includes('@')
    const isCPF = /^\d{11}$/.test(dto.login.replace(/\D/g, ''))

    const user = await this.prisma.user.findFirst({
      where: isEmail
        ? { email: dto.login }
        : isCPF
          ? { cpf: dto.login.replace(/\D/g, '') }
          : { username: dto.login },
      include: { wallet: true },
    })

    if (!user) throw new UnauthorizedException('Credenciais inválidas')
    if (user.status === 'BANNED') throw new UnauthorizedException('Conta banida')
    if (user.status === 'SELF_EXCLUDED') throw new UnauthorizedException('Conta autoexcluída')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Credenciais inválidas')

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: dto.ip },
    })

    const tokens = await this.generateTokens(user.id, user.email)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    return {
      user: this.sanitizeUser(user),
      wallet: { balance: Number(user.wallet?.balance ?? 0) },
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

    const tokens = await this.generateTokens(session.userId, session.user.email)
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

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email }
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

  private async findUserIdByReferral(code: string): Promise<string | undefined> {
    const user = await this.prisma.user.findUnique({ where: { referralCode: code } })
    return user?.id
  }

  private sanitizeUser(user: any) {
    const { passwordHash, twoFactorSecret, ...safe } = user
    return safe
  }
}
