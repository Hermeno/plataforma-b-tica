import { Controller, Post, Body, Headers, HttpCode, Logger } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { WalletService } from '../wallet/wallet.service'

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private payments: PaymentsService,
    private wallet: WalletService,
  ) {}

  @Post('webhook/pix')
  @HttpCode(200)
  async pixWebhook(@Body() body: any) {
    this.logger.log('PIX webhook recebido')
    const data = await this.payments.validatePixWebhook(body)
    if (data) {
      await this.wallet.confirmDeposit(data.txid, data.amount)
    }
    return { ok: true }
  }
}
