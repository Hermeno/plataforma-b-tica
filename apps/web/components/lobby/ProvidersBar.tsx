'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const PROVIDERS = [
  { id: 'all', label: 'Todas', emoji: '🎰' },
  { id: 'pp', label: 'Pragmatic Play', emoji: '🔥' },
  { id: 'pg', label: 'PG Soft', emoji: '⚡' },
  { id: 'jdb', label: 'JDB Gaming', emoji: '🐟' },
  { id: 'spribe', label: 'Spribe', emoji: '🚀' },
  { id: 'habanero', label: 'Habanero', emoji: '🌶️' },
  { id: 'funky', label: 'Funky Games', emoji: '🎸' },
]

export default function ProvidersBar() {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('provider') || 'all'

  const setProvider = (id: string) => {
    const p = new URLSearchParams(params.toString())
    if (id === 'all') p.delete('provider')
    else p.set('provider', id)
    router.push(`/lobby?${p.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
      {PROVIDERS.map(({ id, label, emoji }) => (
        <button
          key={id}
          onClick={() => setProvider(id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 border',
            active === id
              ? 'bg-surface-card border-brand text-brand'
              : 'bg-transparent border-surface-border text-text-muted hover:border-surface-elevated hover:text-text-secondary'
          )}
        >
          <span>{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  )
}
