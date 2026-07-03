import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'

interface PixChargeParams {
  amount: number
  userId: string
  userName: string
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private readonly http: AxiosInstance

  constructor(private config: ConfigService) {
    this.http = axios.create({
      baseURL: 'https://www.vexopay.com.br/api',
      headers: {
        'Content-Type': 'application/json',
        ci: config.get('VEXOPAY_CLIENT_ID', ''),
        cs: config.get('VEXOPAY_CLIENT_SECRET', ''),
      },
      timeout: 15000,
    })
  }

  async createPixCharge({ amount, userId, userName }: PixChargeParams) {
    try {
      const { data } = await this.http.post('/gateway/pix-create', {
        amount,
        payerName: userName || '3633BET User',
        payerDocument: '00000000000',
        description: `Deposito 3633BET #${userId.slice(-8)}`,
      })

      return {
        transactionId: data.transactionId,
        pixCopiaECola: data.pixCopiaECola ?? data.copyPaste ?? '',
        qrCode: data.qrCode ?? data.qrCodeBase64 ?? '',
        paymentLink: data.paymentLink ?? '',
        expiresAt: data.expiresAt ?? '',
        status: data.status ?? 'pending',
      }
    } catch (err: any) {
      this.logger.error('VexoPay PIX error', err?.response?.data ?? err.message)
      throw new InternalServerErrorException('Erro ao gerar PIX. Tente novamente.')
    }
  }

  async getPixStatus(transactionId: string): Promise<{ status: string; amount?: number }> {
    try {
      const { data } = await this.http.get('/gateway/pix-status', {
        params: { transactionId },
      })
      return { status: data.status, amount: data.amount }
    } catch (err: any) {
      this.logger.error('VexoPay status error', err?.response?.data ?? err.message)
      return { status: 'unknown' }
    }
  }

  validateWebhook(body: any): { transactionId: string; amount: number } | null {
    try {
      if (body?.event !== 'payment.completed') return null
      const { transactionId, amount } = body?.data ?? {}
      if (!transactionId || !amount) return null
      return { transactionId, amount: Number(amount) }
    } catch {
      return null
    }
  }
}
