'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import GameGrid from './GameGrid'

interface Game {
  id: string; slug: string; name: string; provider: string
  thumbnail: string; isNew: boolean; isFeatured: boolean; hasDemo: boolean; rtp?: number
}

async function fetchGames(category?: string, provider?: string, search?: string, page = 1) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('cat', category)
  if (provider && provider !== 'all') params.set('provider', provider)
  if (search) params.set('q', search)
  params.set('page', String(page))
  params.set('limit', '48')
  const { data } = await api.get(`/games?${params.toString()}`)
  return data
}

export default function LobbyGames() {
  const params = useSearchParams()
  const category = params.get('cat') || undefined
  const provider = params.get('provider') || undefined
  const search = params.get('q') || undefined

  const { data, isLoading } = useQuery({
    queryKey: ['games', category, provider, search],
    queryFn: () => fetchGames(category, provider, search),
    staleTime: 30000,
  })

  const games: Game[] = data?.data || []
  const featured = games.filter((g) => g.isFeatured).slice(0, 12)
  const newGames = games.filter((g) => g.isNew).slice(0, 12)
  const all = games

  if (!category && !provider && !search) {
    return (
      <div>
        <GameGrid title="🔥 Mais Jogados" games={featured.length ? featured : all.slice(0, 24)} loading={isLoading} initialCount={12} />
        <GameGrid title="⚡ Novidades" games={newGames.length ? newGames : all.slice(12, 24)} loading={isLoading} initialCount={12} />
        <GameGrid title="🎰 Todos os Jogos" games={all} loading={isLoading} initialCount={48} />
      </div>
    )
  }

  const title = provider
    ? `Jogos — ${provider.toUpperCase()}`
    : category
      ? `Categoria: ${category}`
      : `Resultados para "${search}"`

  return <GameGrid title={title} games={all} loading={isLoading} initialCount={48} />
}
