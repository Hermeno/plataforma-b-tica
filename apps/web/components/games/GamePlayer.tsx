'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Maximize2, Minimize2, X, Wallet, Loader2, AlertTriangle } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useWalletStore } from '@/store/walletStore'
import { formatBRL } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useSocket } from '@/hooks/useSocket'

interface Props {
  slug: string
  isDemo: boolean
}

export default function GamePlayer({ slug, isDemo }: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { balance, setBalance } = useWalletStore()
  const [launchUrl, setLaunchUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const socket = useSocket()

  useEffect(() => {
    if (!isAuthenticated && !isDemo) {
      router.push(`/login?redirect=/game/${slug}`)
      return
    }
    launchGame()
  }, [slug, isDemo])

  useEffect(() => {
    if (!socket) return
    socket.on('balance:update', (data: { balance: number }) => {
      setBalance(data.balance)
    })
    return () => { socket.off('balance:update') }
  }, [socket])

  const launchGame = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post(`/games/${slug}/launch`, { demo: isDemo })
      setLaunchUrl(data.launchUrl)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Não foi possível carregar o jogo')
    } finally {
      setLoading(false)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-black">
      {/* Game toolbar */}
      <div className="flex items-center justify-between px-4 h-12 bg-surface/90 backdrop-blur-sm border-b border-surface-border flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-surface-card text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-text-secondary capitalize">
            {slug.replace(/-/g, ' ')}
          </span>
          {isDemo && (
            <span className="badge-brand text-[10px] py-0.5">DEMO</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && !isDemo && (
            <Link href="/carteira?aba=deposito" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-brand/40 transition-all">
              <Wallet className="w-3.5 h-3.5 text-brand" />
              <span className="text-sm font-semibold text-text-primary">{formatBRL(balance)}</span>
            </Link>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-surface-card text-text-muted hover:text-text-primary transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Game frame */}
      <div ref={containerRef} className="flex-1 relative bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface">
            <div className="w-16 h-16 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-lg animate-pulse">
              <span className="text-black font-display text-3xl">L</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin text-brand" />
              <span className="text-sm">Carregando jogo...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface p-6">
            <div className="w-14 h-14 rounded-full bg-neon-red/10 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-neon-red" />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-semibold mb-1">{error}</p>
              {error.includes('KYC') && (
                <p className="text-text-muted text-sm">
                  <Link href="/perfil?aba=kyc" className="text-brand underline">Verificar identidade</Link>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={launchGame} className="btn-brand px-5 py-2.5 text-sm">Tentar novamente</button>
              <button onClick={() => router.back()} className="btn-ghost px-5 py-2.5 text-sm">Voltar</button>
            </div>
          </div>
        )}

        {launchUrl && (
          <iframe
            src={launchUrl}
            className={cn('w-full h-full border-0', loading && 'opacity-0')}
            onLoad={() => setLoading(false)}
            allow="fullscreen; autoplay"
            title="Jogo"
          />
        )}
      </div>
    </div>
  )
}
