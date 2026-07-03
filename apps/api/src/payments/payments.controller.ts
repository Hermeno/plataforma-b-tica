import { Controller, Post, Body, HttpCode, Logger } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { WalletService } from '../wallet/wallet.service'

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private payments: PaymentsService,
    private wallet: WalletService,
  ) {}

  @Post('webhook/vexopay')
  @HttpCode(200)
  async vexoWebhook(@Body() body: any) {
    this.logger.log(`VexoPay webhook: ${body?.event}`)
    const data = this.payments.validateWebhook(body)
    if (data) {
      await this.wallet.confirmDeposit(data.transactionId, data.amount)
    }
    return { ok: true }
  }
}
