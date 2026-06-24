import { Module, forwardRef } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { WalletModule } from '../wallet/wallet.module'

@Module({
  imports: [forwardRef(() => WalletModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
