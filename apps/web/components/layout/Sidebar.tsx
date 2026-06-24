'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Gamepad2, Zap, Fish, Tv, LayoutGrid, Star, Flame,
  Clock, Gift, Users, ChevronRight, Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Todos os Jogos', href: '/lobby', icon: LayoutGrid },
  { label: 'Populares', href: '/lobby?cat=populares', icon: Flame },
  { label: 'Novidades', href: '/lobby?cat=novidades', icon: Zap },
  { label: 'Slots', href: '/lobby?cat=slots', icon: Gamepad2 },
  { label: 'Fish Games', href: '/lobby?cat=fish', icon: Fish },
  { label: 'Crash', href: '/lobby?cat=crash', icon: Zap },
  { label: 'Casino Ao Vivo', href: '/lobby?cat=live', icon: Tv },
  { label: 'Favoritos', href: '/lobby?cat=favoritos', icon: Star },
  { label: 'Recentes', href: '/lobby?cat=recentes', icon: Clock },
]

const PROVIDERS = [
  { label: 'Pragmatic Play', id: 'pp', color: '#E63946' },
  { label: 'PG Soft', id: 'pg', color: '#7B2D8B' },
  { label: 'JDB Gaming', id: 'jdb', color: '#F4A261' },
  { label: 'Funky Games', id: 'fg', color: '#2EC4B6' },
  { label: 'Habanero', id: 'hab', color: '#E9C46A' },
  { label: 'Spribe', id: 'spribe', color: '#06D6A0' },
]

const QUICK_LINKS = [
  { label: 'Bônus', href: '/bonus', icon: Gift },
  { label: 'Afiliados', href: '/afiliados', icon: Users },
  { label: 'Torneios', href: '/torneios', icon: Trophy },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-[calc(100vh-64px)] sticky top-16 bg-surface border-r border-surface-border overflow-y-auto scrollbar-hide flex-shrink-0">
      <div className="p-3 space-y-1">

        {/* Categories */}
        <div className="mb-2">
          <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Categorias
          </p>
          {CATEGORIES.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/lobby' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-item', isActive && 'active')}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="border-t border-surface-border my-2" />

        {/* Providers */}
        <div className="mb-2">
          <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Provedoras
          </p>
          {PROVIDERS.map((provider) => (
            <Link
              key={provider.id}
              href={`/lobby?provider=${provider.id}`}
              className="sidebar-item group"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: provider.color }}
              />
              <span className="flex-1">{provider.label}</span>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        <div className="border-t border-surface-border my-2" />

        {/* Quick Links */}
        <div>
          <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Menu
          </p>
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-item"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="m-3 mt-auto">
        <div className="card p-4 bg-gradient-to-br from-brand/20 to-brand/5 border-brand/30">
          <p className="text-xs text-brand font-semibold uppercase tracking-wide mb-1">Bônus de Boas-vindas</p>
          <p className="text-lg font-bold text-text-primary leading-tight">100% até</p>
          <p className="text-2xl font-display text-brand">R$ 500</p>
          <Link href="/cadastro" className="btn-brand w-full mt-3 py-2 text-xs">
            Resgatar Agora
          </Link>
        </div>
      </div>
    </aside>
  )
}
