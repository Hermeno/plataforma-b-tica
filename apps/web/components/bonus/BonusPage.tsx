'use client'

import { useEffect, useState } from 'react'
import { Gift, Zap, RefreshCw, Star, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { formatBRL } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const AVAILABLE_BONUSES = [
  {
    id: 'welcome',
    type: 'WELCOME',
    title: 'Bônus de Boas-vindas',
    description: '100% do seu primeiro depósito até R$ 500',
    icon: Gift,
    color: 'from-brand/20 to-brand/5 border-brand/30',
    iconColor: 'text-brand',
    badge: 'Exclusivo',
    badgeColor: 'bg-brand text-black',
    rollover: '30x',
    expiry: '7 dias',
    minDeposit: 'R$ 20',
  },
  {
    id: 'reload',
    type: 'RELOAD',
    title: 'Recarga de Sábado',
    description: '50% até R$ 200 em todo depósito feito no sábado',
    icon: RefreshCw,
    color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    iconColor: 'text-purple-400',
    badge: 'Semanal',
    badgeColor: 'bg-purple-500 text-white',
    rollover: '25x',
    expiry: '3 dias',
    minDeposit: 'R$ 20',
  },
  {
    id: 'cashback',
    type: 'CASHBACK',
    title: 'Cashback Semanal',
    description: '10% de cashback nas suas perdas da semana',
    icon: Zap,
    color: 'from-neon-green/10 to-neon-green/5 border-neon-green/20',
    iconColor: 'text-neon-green',
    badge: 'Automático',
    badgeColor: 'bg-neon-green text-black',
    rollover: '1x',
    expiry: 'Automático',
    minDeposit: '—',
  },
  {
    id: 'freespins',
    type: 'FREESPINS',
    title: 'Free Spins PP',
    description: '50 giros grátis no Gates of Olympus da Pragmatic Play',
    icon: Star,
    color: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    iconColor: 'text-amber-400',
    badge: 'Limitado',
    badgeColor: 'bg-amber-500 text-black',
    rollover: '40x',
    expiry: '3 dias',
    minDeposit: 'R$ 50',
  },
]

interface ActiveBonus {
  id: string
  bonus: { name: string; type: string }
  bonusAmount: number
  remainingRollover: number
  expiresAt: string
  status: string
}

export default function BonusPage() {
  const [activeBonuses, setActiveBonuses] = useState<ActiveBonus[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bonus/active').then((r) => setActiveBonuses(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const claimBonus = async (bonusId: string) => {
    setLoadingId(bonusId)
    try {
      await api.post(`/bonus/claim/${bonusId}`)
      toast.success('Bônus resgatado com sucesso!')
      const r = await api.get('/bonus/active')
      setActiveBonuses(r.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao resgatar bônus')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Bônus & Promoções</h1>
      <p className="text-text-muted text-sm mb-6">Aproveite nossas promoções exclusivas para jogadores brasileiros</p>

      {/* Active bonuses */}
      {!loading && activeBonuses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neon-green" /> Bônus Ativos
          </h2>
          <div className="space-y-3">
            {activeBonuses.map((ab) => (
              <div key={ab.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{ab.bonus.name}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Expira: {new Date(ab.expiresAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-brand">{formatBRL(ab.bonusAmount)}</p>
                </div>
                {/* Rollover progress */}
                <div>
                  <div className="flex justify-between text-xs text-text-muted mb-1">
                    <span>Rollover restante</span>
                    <span className="font-medium text-text-primary">{formatBRL(ab.remainingRollover)}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gradient rounded-full transition-all"
                      style={{ width: `${Math.max(5, 100 - (ab.remainingRollover / (ab.bonusAmount * 30)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available bonuses */}
      <h2 className="text-base font-semibold text-text-primary mb-4">Promoções Disponíveis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AVAILABLE_BONUSES.map((bonus) => {
          const Icon = bonus.icon
          return (
            <div key={bonus.id} className={cn('card p-5 bg-gradient-to-br', bonus.color)}>
              <div className="flex items-start justify-between mb-3">
                <Icon className={cn('w-8 h-8', bonus.iconColor)} />
                <span className={cn('text-xs px-2 py-0.5 rounded font-semibold', bonus.badgeColor)}>
                  {bonus.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">{bonus.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{bonus.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Rollover', value: bonus.rollover },
                  { label: 'Validade', value: bonus.expiry },
                  { label: 'Dep. mín.', value: bonus.minDeposit },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs text-text-muted">{label}</p>
                    <p className="text-xs font-semibold text-text-primary mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => claimBonus(bonus.id)}
                disabled={loadingId === bonus.id}
                className="btn-brand w-full py-2 text-sm"
              >
                {loadingId === bonus.id
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Resgatando...</>
                  : 'Resgatar Bônus'
                }
              </button>
            </div>
          )
        })}
      </div>

      {/* Terms */}
      <p className="text-xs text-text-muted text-center mt-8">
        Todos os bônus possuem termos e condições.{' '}
        <a href="/termos-bonus" className="text-brand underline">Leia os termos completos</a>.
        Jogadores com bônus ativo devem completar o rollover antes de sacar.
      </p>
    </div>
  )
}
