import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  transports: ['websocket'],
})
export class WalletGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(WalletGateway.name)
  private userSockets = new Map<string, string>()

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token
      if (!token) { client.disconnect(); return }

      const payload = this.jwt.verify(token, { secret: this.config.get('JWT_SECRET') })
      this.userSockets.set(payload.sub, client.id)
      client.data.userId = payload.sub
      client.join(`user:${payload.sub}`)
      this.logger.log(`Socket conectado: ${payload.sub}`)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.userSockets.delete(client.data.userId)
    }
  }

  emitBalanceUpdate(userId: string, balance: number) {
    this.server.to(`user:${userId}`).emit('balance:update', { balance })
  }

  emitDepositConfirmed(userId: string, amount: number, balance: number) {
    this.server.to(`user:${userId}`).emit('deposit:confirmed', { amount, balance })
  }

  emitNotification(userId: string, title: string, body: string) {
    this.server.to(`user:${userId}`).emit('notification', { title, body })
  }
}
