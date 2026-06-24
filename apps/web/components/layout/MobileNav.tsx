'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Wallet, Gift, User, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Início', href: '/', icon: Home },
  { label: 'Jogos', href: '/lobby', icon: LayoutGrid },
  { label: 'Carteira', href: '/carteira', icon: Wallet },
  { label: 'Bônus', href: '/bonus', icon: Gift },
  { label: 'Perfil', href: '/perfil', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-surface-border">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[52px]',
                isActive
                  ? 'text-brand'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'glow-brand')} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
