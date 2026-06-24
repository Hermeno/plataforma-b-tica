import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common'
import { BonusService } from './bonus.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@Controller('bonus')
@UseGuards(JwtAuthGuard)
export class BonusController {
  constructor(private service: BonusService) {}

  @Get('active')
  getActive(@Req() req: any) {
    return this.service.getActiveBonuses(req.user.id)
  }

  @Post('claim/:id')
  claim(@Req() req: any, @Param('id') bonusId: string) {
    return this.service.claimBonus(req.user.id, bonusId)
  }
}
