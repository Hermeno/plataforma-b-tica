'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Bell, Wallet, ChevronDown, LogOut, User, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useWalletStore } from '@/store/walletStore'
import { formatBRL } from '@/lib/utils'

export default function Header() {
  const { user, logout } = useAuthStore()
  const { balance } = useWalletStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 max-w-[1920px] mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand">
            <span className="text-black font-display text-lg">3</span>
          </div>
          <span className="font-display text-2xl text-gradient-brand tracking-wide hidden sm:block">
            3633BET
          </span>
        </Link>

        {/* Search bar — desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar jogos, provedoras..."
              className="input-base pl-10 py-2 text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search icon — mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-card text-text-secondary"
          >
            <Search className="w-5 h-5" />
          </button>

          {user ? (
            <>
              {/* Balance */}
              <Link
                href="/carteira"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-surface-border hover:border-brand/40 transition-all"
              >
                <Wallet className="w-4 h-4 text-brand" />
                <span className="text-sm font-semibold text-text-primary">
                  {formatBRL(balance)}
                </span>
              </Link>

              {/* Deposit button */}
              <Link href="/carteira?aba=deposito" className="btn-brand py-2 px-4 text-xs hidden sm:flex">
                + Depositar
              </Link>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-surface-card text-text-secondary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-card transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center">
                    <span className="text-black text-sm font-bold">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 card shadow-card py-1 z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b border-surface-border">
                      <p className="text-sm font-semibold text-text-primary">{user.username}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                    <Link href="/perfil" className="flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated text-sm text-text-secondary hover:text-text-primary transition-colors">
                      <User className="w-4 h-4" /> Meu Perfil
                    </Link>
                    <Link href="/carteira" className="flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated text-sm text-text-secondary hover:text-text-primary transition-colors">
                      <Wallet className="w-4 h-4" /> Carteira
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-4 py-3 w-full hover:bg-surface-elevated text-sm text-neon-red transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost py-2 px-4 text-sm">
                Entrar
              </Link>
              <Link href="/cadastro" className="btn-brand py-2 px-4 text-sm">
                Cadastrar
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-card text-text-secondary ml-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3 animate-slide-down">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar jogos..."
              className="input-base pl-10 py-2.5 text-sm"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
