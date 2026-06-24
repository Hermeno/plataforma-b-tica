import type { Metadata } from 'next'
import GamePlayer from '@/components/games/GamePlayer'

interface Props { params: { slug: string }; searchParams: { demo?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Jogar — ${params.slug.replace(/-/g, ' ')}` }
}

export default function GamePage({ params, searchParams }: Props) {
  return (
    <GamePlayer
      slug={params.slug}
      isDemo={searchParams.demo === 'true'}
    />
  )
}
