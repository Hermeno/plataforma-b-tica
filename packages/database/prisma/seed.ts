import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco...')

  // Bônus
  await prisma.bonus.createMany({
    data: [
      {
        name: 'Bônus de Boas-vindas',
        type: 'WELCOME',
        percentage: 1.0,
        maxAmount: 500,
        rolloverMultiplier: 30,
        minDeposit: 20,
        expiresInDays: 7,
        isActive: true,
      },
      {
        name: 'Recarga de Sábado',
        type: 'RELOAD',
        percentage: 0.5,
        maxAmount: 200,
        rolloverMultiplier: 25,
        minDeposit: 20,
        expiresInDays: 3,
        isActive: true,
      },
      {
        name: 'Cashback Semanal',
        type: 'CASHBACK',
        percentage: 0.1,
        rolloverMultiplier: 1,
        minDeposit: 0,
        expiresInDays: 7,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })

  // Jogos de exemplo (serão sincronizados do agregador em produção)
  await prisma.game.createMany({
    data: [
      { externalId: 'pp_vs20olympgate', aggregatorId: 'hub88', name: 'Gates of Olympus', slug: 'gates-of-olympus', category: 'SLOTS', provider: 'Pragmatic Play', thumbnail: '/games/gates-of-olympus.webp', rtp: 96.5, isFeatured: true, isNew: false, hasDemo: true },
      { externalId: 'pp_vs20sugarrush', aggregatorId: 'hub88', name: 'Sugar Rush', slug: 'sugar-rush', category: 'SLOTS', provider: 'Pragmatic Play', thumbnail: '/games/sugar-rush.webp', rtp: 96.5, isFeatured: true, isNew: false, hasDemo: true },
      { externalId: 'pp_vs20doghouse', aggregatorId: 'hub88', name: 'The Dog House', slug: 'the-dog-house', category: 'SLOTS', provider: 'Pragmatic Play', thumbnail: '/games/dog-house.webp', rtp: 96.51, isFeatured: false, isNew: false, hasDemo: true },
      { externalId: 'pg_mahjongways2', aggregatorId: 'hub88', name: 'Mahjong Ways 2', slug: 'mahjong-ways-2', category: 'SLOTS', provider: 'PG Soft', thumbnail: '/games/mahjong-ways-2.webp', rtp: 96.95, isFeatured: true, isNew: true, hasDemo: true },
      { externalId: 'pg_fortunetiger', aggregatorId: 'hub88', name: 'Fortune Tiger', slug: 'fortune-tiger', category: 'SLOTS', provider: 'PG Soft', thumbnail: '/games/fortune-tiger.webp', rtp: 96.81, isFeatured: true, isNew: false, hasDemo: true },
      { externalId: 'jdb_fishingwargod', aggregatorId: 'hub88', name: 'Fishing War God', slug: 'fishing-war-god', category: 'FISH', provider: 'JDB Gaming', thumbnail: '/games/fishing-war-god.webp', rtp: 97.0, isFeatured: true, isNew: false, hasDemo: false },
      { externalId: 'spribe_aviator', aggregatorId: 'hub88', name: 'Aviator', slug: 'aviator', category: 'CRASH', provider: 'Spribe', thumbnail: '/games/aviator.webp', rtp: 97.0, isFeatured: true, isNew: false, hasDemo: true },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
