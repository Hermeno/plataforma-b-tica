import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bull'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { WalletModule } from './wallet/wallet.module'
import { GamesModule } from './games/games.module'
import { PaymentsModule } from './payments/payments.module'
import { KycModule } from './kyc/kyc.module'
import { BonusModule } from './bonus/bonus.module'
import { AdminModule } from './admin/admin.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { GatewayModule } from './gateway/gateway.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: { host: config.get('REDIS_HOST', 'localhost'), port: config.get('REDIS_PORT', 6379) },
      }),
    }),

    ScheduleModule.forRoot(),
    PrismaModule,
    GatewayModule,
    AuthModule,
    UsersModule,
    WalletModule,
    GamesModule,
    PaymentsModule,
    KycModule,
    BonusModule,
    AdminModule,
  ],
})
export class AppModule {}
