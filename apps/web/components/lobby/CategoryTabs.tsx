'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Gamepad2, Zap, Fish, Tv, Flame, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'populares', label: 'Populares', icon: Flame },
  { id: 'slots', label: 'Slots', icon: Gamepad2 },
  { id: 'crash', label: 'Crash', icon: Zap },
  { id: 'fish', label: 'Fish Games', icon: Fish },
  { id: 'live', label: 'Ao Vivo', icon: Tv },
  { id: 'favoritos', label: 'Favoritos', icon: Star },
]

export default function CategoryTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const active = searchParams.get('cat') || 'populares'

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('cat', id)
    router.push(`/lobby?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
            active === id
              ? 'bg-brand text-black shadow-brand'
              : 'bg-surface-card text-text-secondary border border-surface-border hover:border-brand/40 hover:text-text-primary'
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
