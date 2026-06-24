import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AdminGuard } from '../common/guards/admin.guard'

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private service: AdminService) {}

  @Get('dashboard')
  getDashboard() { return this.service.getDashboard() }

  @Get('users')
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('q') search?: string,
    @Query('status') status?: string,
  ) { return this.service.getUsers(+page, +limit, search, status) }

  @Patch('users/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateUserStatus(id, status)
  }

  @Get('withdrawals/pending')
  getPendingWithdrawals(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.getPendingWithdrawals(+page, +limit)
  }

  @Post('withdrawals/:id/approve')
  approveWithdrawal(@Param('id') id: string) { return this.service.approveWithdrawal(id) }

  @Post('withdrawals/:id/reject')
  rejectWithdrawal(@Param('id') id: string, @Body('reason') reason: string) {
    return this.service.rejectWithdrawal(id, reason)
  }

  @Get('kyc/pending')
  getKycPending(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.getKycPending(+page, +limit)
  }

  @Post('kyc/:id/approve')
  approveKyc(@Param('id') id: string) { return this.service.approveKyc(id) }

  @Post('kyc/:id/reject')
  rejectKyc(@Param('id') id: string, @Body('reason') reason: string) {
    return this.service.rejectKyc(id, reason)
  }

  @Get('games')
  getGames(@Query('page') page = 1, @Query('limit') limit = 30, @Query('q') search?: string) {
    return this.service.getGames(+page, +limit, search)
  }

  @Patch('games/:id/toggle')
  toggleGame(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.service.toggleGame(id, isActive)
  }
}
