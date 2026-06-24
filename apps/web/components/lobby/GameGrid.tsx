'use client'

import { useState } from 'react'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'
import { ChevronDown } from 'lucide-react'

interface Game {
  id: string
  slug: string
  name: string
  provider: string
  thumbnail: string
  isNew?: boolean
  isFeatured?: boolean
  hasDemo?: boolean
  rtp?: number
}

interface GameGridProps {
  title: string
  games: Game[]
  loading?: boolean
  showMore?: boolean
  initialCount?: number
}

export default function GameGrid({
  title,
  games,
  loading = false,
  showMore = true,
  initialCount = 24,
}: GameGridProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedGames = showAll ? games : games.slice(0, initialCount)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          {title}
          {!loading && (
            <span className="text-sm text-text-muted font-normal">({games.length})</span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 sm:gap-3">
        {loading
          ? Array.from({ length: initialCount }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))
          : displayedGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
      </div>

      {showMore && !loading && games.length > initialCount && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-ghost gap-2"
          >
            {showAll ? 'Ver menos' : `Ver todos (${games.length})`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </section>
  )
}
