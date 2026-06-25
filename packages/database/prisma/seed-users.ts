import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const users = [
  { fullName: 'Admin Master',      phone: '11999990001', password: 'Admin@1234',  role: 'ADMIN' as const,  balance: 0 },
  { fullName: 'Carlos Silva',      phone: '11988880001', password: 'Teste@1234',  role: 'USER' as const,   balance: 500 },
  { fullName: 'Ana Oliveira',      phone: '21977770001', password: 'Teste@1234',  role: 'USER' as const,   balance: 250 },
  { fullName: 'João Santos',       phone: '31966660001', password: 'Teste@1234',  role: 'USER' as const,   balance: 100 },
  { fullName: 'Fernanda Costa',    phone: '41955550001', password: 'Teste@1234',  role: 'USER' as const,   balance: 750 },
]

async function main() {
  console.log('👤 Criando usuários de teste...')

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12)
    const username = u.fullName.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 99)

    const existing = await prisma.user.findUnique({ where: { phone: u.phone } })
    if (existing) {
      console.log(`  ⚠️  ${u.phone} já existe, pulando...`)
      continue
    }

    await prisma.user.create({
      data: {
        phone: u.phone,
        username,
        passwordHash,
        fullName: u.fullName,
        role: u.role,
        status: 'ACTIVE',
        wallet: {
          create: {
            balance: u.balance,
            bonusBalance: u.role === 'USER' ? 40 : 0,
            rolloverRequired: u.role === 'USER' ? 150 : 0,
            rolloverCompleted: 0,
          },
        },
      },
    })

    console.log(`  ✅ ${u.fullName} — ${u.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')} / senha: ${u.password}`)
  }

  console.log('\n✅ Usuários criados!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
