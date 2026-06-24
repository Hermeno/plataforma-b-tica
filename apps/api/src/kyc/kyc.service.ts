import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class KycService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async submitDocuments(userId: string, docType: string, files: { front: string; back?: string; selfie: string }) {
    const existing = await this.prisma.kycDocument.findFirst({
      where: { userId, status: { in: ['PENDING', 'APPROVED'] } },
    })
    if (existing?.status === 'APPROVED') throw new BadRequestException('KYC já aprovado')
    if (existing?.status === 'PENDING') throw new BadRequestException('KYC já enviado e em análise')

    const doc = await this.prisma.kycDocument.create({
      data: {
        userId,
        docType,
        frontUrl: files.front,
        backUrl: files.back,
        selfieUrl: files.selfie,
        status: 'PENDING',
        provider: 'manual',
      },
    })

    await this.prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'PENDING' },
    })

    return { message: 'Documentos enviados com sucesso. Análise em até 2 dias úteis.', docId: doc.id }
  }

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    })
    const latestDoc = await this.prisma.kycDocument.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { status: true, rejectionReason: true, createdAt: true },
    })
    return { kycStatus: user?.kycStatus, latestDoc }
  }
}
