'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { formatBRL } from '@/lib/utils'

const LIMIT_TYPES = [
  { id: 'DEPOSIT_DAILY', label: 'Limite diário de depósito', unit: 'R$', type: 'money' },
  { id: 'DEPOSIT_WEEKLY', label: 'Limite semanal de depósito', unit: 'R$', type: 'money' },
  { id: 'DEPOSIT_MONTHLY', label: 'Limite mensal de depósito', unit: 'R$', type: 'money' },
  { id: 'SESSION_TIME', label: 'Limite de sessão por dia', unit: 'horas', type: 'time' },
]

export default function ResponsibleGaming() {
  const [limits, setLimits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [selfExclude, setSelfExclude] = useState(false)
  const [excludePeriod, setExcludePeriod] = useState('30')

  const setLimit = async (type: string, value: string) => {
    setLoading(type)
    try {
      await api.post('/users/limits', { limitType: type, amount: parseFloat(value) })
      toast.success('Limite definido com sucesso!')
    } catch {
      toast.error('Erro ao definir limite')
    } finally {
      setLoading(null)
    }
  }

  const handleSelfExclusion = async () => {
    if (!confirm(`Confirma a autoexclusão por ${excludePeriod} dias? Sua conta será suspensa.`)) return
    try {
      await api.post('/users/self-exclude', { days: parseInt(excludePeriod) })
      toast.success('Autoexclusão ativada. Cuide-se!')
    } catch {
      toast.error('Erro ao processar autoexclusão')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-4 bg-neon-blue/5 border-neon-blue/20 flex items-start gap-3">
        <Shield className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-primary">Jogo Responsável</p>
          <p className="text-xs text-text-secondary mt-1">
            Defina limites para controlar seus gastos e tempo de jogo. Esses limites são aplicados imediatamente.
          </p>
        </div>
      </div>

      {/* Limits */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-text-primary">Definir Limites</p>
        {LIMIT_TYPES.map((limitType) => (
          <div key={limitType.id} className="card p-4">
            <p className="text-sm font-medium text-text-primary mb-2">{limitType.label}</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                  {limitType.unit}
                </span>
                <input
                  type="number"
                  placeholder={limitType.type === 'money' ? '0,00' : '0'}
                  value={limits[limitType.id] || ''}
                  onChange={(e) => setLimits((p) => ({ ...p, [limitType.id]: e.target.value }))}
                  className="input-base pl-8"
                  min={0}
                />
              </div>
              <button
                onClick={() => setLimit(limitType.id, limits[limitType.id] || '0')}
                disabled={loading === limitType.id || !limits[limitType.id]}
                className="btn-brand px-4 py-2 text-sm disabled:opacity-50"
              >
                {loading === limitType.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Definir'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Self exclusion */}
      <div className="card p-4 border-neon-red/20 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-neon-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Autoexclusão</p>
            <p className="text-xs text-text-secondary mt-1">
              Suspende sua conta temporariamente. Você não conseguirá acessar a plataforma durante o período.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Período de exclusão</label>
          <select
            value={excludePeriod}
            onChange={(e) => setExcludePeriod(e.target.value)}
            className="input-base text-sm"
          >
            <option value="7">7 dias</option>
            <option value="30">30 dias</option>
            <option value="90">90 dias</option>
            <option value="180">6 meses</option>
            <option value="365">1 ano</option>
          </select>
        </div>

        <button onClick={handleSelfExclusion} className="btn-ghost w-full py-2.5 text-sm border-neon-red/30 text-neon-red hover:bg-neon-red/5">
          Ativar Autoexclusão
        </button>

        <p className="text-xs text-center text-text-muted">
          Também disponível em:{' '}
          <a href="https://autoprevina.com.br" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            AUTOPREVINA.com.br
          </a>
        </p>
      </div>
    </div>
  )
}
