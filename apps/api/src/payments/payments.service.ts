import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import * as fs from 'fs'
import * as https from 'https'

interface PixChargeParams {
  amount: number
  userId: string
  userCpf: string
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(private config: ConfigService) {}

  async createPixCharge({ amount, userId, userCpf }: PixChargeParams) {
    const token = await this.getEfiToken()
    const isSandbox = this.config.get('EFI_SANDBOX', 'true') === 'true'
    const baseUrl = isSandbox
      ? 'https://pix-h.api.efipay.com.br'
      : 'https://pix.api.efipay.com.br'

    const agent = this.getHttpsAgent()
    const txid = this.generateTxid()

    const payload = {
      calendario: { expiracao: 3600 },
      devedor: { cpf: userCpf },
      valor: { original: amount.toFixed(2) },
      chave: this.config.get('EFI_PIX_KEY'),
      infoAdicionais: [{ nome: 'Plataforma', valor: 'Leaozinho' }],
    }

    const { data } = await axios.put(`${baseUrl}/v2/cob/${txid}`, payload, {
      httpsAgent: agent,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })

    const qrData = await axios.get(`${baseUrl}/v2/loc/${data.loc.id}/qrcode`, {
      httpsAgent: agent,
      headers: { Authorization: `Bearer ${token}` },
    })

    return {
      txid: data.txid,
      pixCopiaECola: qrData.data.pixCopiaECola,
      qrCode: qrData.data.imagemQrcode,
      calendario: data.calendario,
    }
  }

  async validatePixWebhook(payload: any): Promise<{ txid: string; amount: number } | null> {
    try {
      const pix = payload?.pix?.[0]
      if (!pix) return null
      return { txid: pix.txid, amount: parseFloat(pix.valor) }
    } catch {
      return null
    }
  }

  private async getEfiToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken
    }

    const clientId = this.config.get('EFI_CLIENT_ID')
    const clientSecret = this.config.get('EFI_CLIENT_SECRET')
    const isSandbox = this.config.get('EFI_SANDBOX', 'true') === 'true'
    const baseUrl = isSandbox
      ? 'https://cobrancas-h.api.efipay.com.br'
      : 'https://cobrancas.api.efipay.com.br'

    const agent = this.getHttpsAgent()
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const { data } = await axios.post(
      `${baseUrl}/v1/authorize`,
      { grant_type: 'client_credentials' },
      {
        httpsAgent: agent,
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      }
    )

    this.accessToken = data.access_token
    this.tokenExpiry = new Date(Date.now() + (data.expires_in - 60) * 1000)
    return this.accessToken!
  }

  private getHttpsAgent() {
    const certPath = this.config.get('EFI_CERT_PATH')
    if (certPath && fs.existsSync(certPath)) {
      return new https.Agent({ pfx: fs.readFileSync(certPath), passphrase: '' })
    }
    return new https.Agent({ rejectUnauthorized: false })
  }

  private generateTxid(): string {
    return Array.from({ length: 35 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
        Math.floor(Math.random() * 62)
      )
    ).join('')
  }
}
