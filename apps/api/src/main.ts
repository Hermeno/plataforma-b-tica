import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as compression from 'compression'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3001)

  app.use(helmet())
  app.use(compression())

  const rawOrigin = config.get<string>('APP_URL', 'http://localhost:3000').replace(/\/$/, '')
  app.enableCors({
    origin: [rawOrigin, rawOrigin + '/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )

  await app.listen(port)
  console.log(`🦁 Leaozinho API rodando na porta ${port}`)
}

bootstrap()
