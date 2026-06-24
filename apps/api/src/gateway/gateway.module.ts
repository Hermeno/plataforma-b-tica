import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { WalletGateway } from './wallet.gateway'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ secret: c.get('JWT_SECRET') }),
    }),
  ],
  providers: [WalletGateway],
  exports: [WalletGateway],
})
export class GatewayModule {}
