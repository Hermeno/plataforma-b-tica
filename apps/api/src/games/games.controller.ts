import { Controller, Get, Post, Query, Param, Body, UseGuards, Req, HttpCode } from '@nestjs/common'
import { GamesService } from './games.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  @Get()
  getLobby(
    @Query('cat') category?: string,
    @Query('provider') provider?: string,
    @Query('q') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 48,
  ) {
    return this.games.getLobby(category, provider, search, +page, +limit)
  }

  @Post(':slug/launch')
  @UseGuards(JwtAuthGuard)
  launch(@Param('slug') slug: string, @Req() req: any, @Body('demo') demo = false) {
    return this.games.launchGame(req.user.id, slug, demo)
  }

  // ---- SEAMLESS WALLET CALLBACKS (Hub88) ----
  @Post('callback/balance')
  @HttpCode(200)
  balance(@Body() body: any) { return this.games.handleBalance(body) }

  @Post('callback/debit')
  @HttpCode(200)
  debit(@Body() body: any) { return this.games.handleDebit(body) }

  @Post('callback/credit')
  @HttpCode(200)
  credit(@Body() body: any) { return this.games.handleCredit(body) }

  @Post('callback/rollback')
  @HttpCode(200)
  rollback(@Body() body: any) { return this.games.handleRollback(body) }
}
