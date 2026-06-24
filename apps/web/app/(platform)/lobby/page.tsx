import type { Metadata } from 'next'
import HeroBanner from '@/components/lobby/HeroBanner'
import GameGrid from '@/components/lobby/GameGrid'
import CategoryTabs from '@/components/lobby/CategoryTabs'
import ProvidersBar from '@/components/lobby/ProvidersBar'
import LobbyGames from '@/components/lobby/LobbyGames'

export const metadata: Metadata = {
  title: 'Lobby de Jogos',
  description: 'Todos os jogos de cassino: slots, fish games, crash e casino ao vivo.',
}

export default function LobbyPage() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <HeroBanner />
      <CategoryTabs />
      <ProvidersBar />
      <LobbyGames />
    </div>
  )
}
