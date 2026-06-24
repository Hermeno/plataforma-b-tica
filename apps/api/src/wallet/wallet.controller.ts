import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common'
import { WalletService } from './wallet.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get()
  getBalance(@Req() req: any) {
    return this.wallet.getBalance(req.user.id)
  }

  @Post('deposit/pix')
  createDeposit(@Req() req: any, @Body('amount') amount: number) {
    return this.wallet.createPixDeposit(req.user.id, amount)
  }

  @Post('withdraw')
  createWithdrawal(
    @Req() req: any,
    @Body('amount') amount: number,
    @Body('pixKey') pixKey: string,
    @Body('pixKeyType') pixKeyType: string,
  ) {
    return this.wallet.createWithdrawal(req.user.id, amount, pixKey, pixKeyType)
  }

  @Get('transactions')
  getTransactions(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.wallet.getTransactions(req.user.id, +page, +limit)
  }
}
