'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Wallet, ShieldCheck,
  Gamepad2, BarChart3, Settings, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users },
  { label: 'Saques', href: '/admin/saques', icon: Wallet },
  { label: 'KYC', href: '/admin/kyc', icon: ShieldCheck },
  { label: 'Jogos', href: '/admin/jogos', icon: Gamepad2 },
  { label: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
  { label: 'Configurações', href: '/admin/config', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  return (
    <aside className="w-60 bg-surface border-r border-surface-border flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="3633BET" width={36} height={36} className="rounded-lg flex-shrink-0" />
          <p className="text-xs text-brand font-semibold">Painel Admin</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-text-secondary hover:bg-surface-card hover:text-text-primary'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-surface-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neon-red hover:bg-neon-red/5 w-full transition-all"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </aside>
  )
}
