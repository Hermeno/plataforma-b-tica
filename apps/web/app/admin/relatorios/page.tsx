'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Gamepad2, BarChart3 } from 'lucide-react'

const PERIODS = ['Hoje', '7 dias', '30 dias', '3 meses', '12 meses']

const MOCK_METRICS = {
  'Hoje':     { ggr: 1240, deposits: 8500, withdrawals: 3200, newUsers: 12, activeSessions: 34, bets: 892 },
  '7 dias':   { ggr: 8750, deposits: 52000, withdrawals: 21000, newUsers: 87, activeSessions: 34, bets: 6240 },
  '30 dias':  { ggr: 34200, deposits: 215000, withdrawals: 87000, newUsers: 342, activeSessions: 34, bets: 24800 },
  '3 meses':  { ggr: 98400, deposits: 640000, withdrawals: 260000, newUsers: 1024, activeSessions: 34, bets: 74200 },
  '12 meses': { ggr: 380000, deposits: 2400000, withdrawals: 980000, newUsers: 4200, activeSessions: 34, bets: 290000 },
}

const BRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const GAME_STATS = [
  { name: 'Fortune Tiger', bets: 3240, ggr: 12400, margin: '8.2%' },
  { name: 'Aviator', bets: 2800, ggr: 9800, margin: '7.9%' },
  { name: 'Gates of Olympus', bets: 2100, ggr: 7600, margin: '8.1%' },
  { name: 'Fortune Ox', bets: 1900, ggr: 6200, margin: '7.4%' },
  { name: 'Sweet Bonanza', bets: 1540, ggr: 5100, margin: '7.5%' },
]

export default function RelatoriosPage() {
  const [period, setPeriod] = useState('7 dias')
  const m = MOCK_METRICS[period as keyof typeof MOCK_METRICS]

  const cards = [
    { label: 'GGR (Receita Líquida)', value: BRL(m.ggr), icon: BarChart3, color: 'text-brand', trend: '+12%' },
    { label: 'Total Depositado', value: BRL(m.deposits), icon: TrendingUp, color: 'text-neon-green', trend: '+8%' },
    { label: 'Total Sacado', value: BRL(m.withdrawals), icon: TrendingDown, color: 'text-neon-red', trend: '+5%' },
    { label: 'Novos Usuários', value: m.newUsers.toString(), icon: Users, color: 'text-amber-400', trend: '+15%' },
    { label: 'Apostas Realizadas', value: m.bets.toLocaleString('pt-BR'), icon: Gamepad2, color: 'text-brand', trend: '+10%' },
    { label: 'Margem Operacional', value: ((m.ggr / m.deposits) * 100).toFixed(1) + '%', icon: DollarSign, color: 'text-neon-green', trend: '' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Relatórios</h1>
          <p className="text-text-muted text-sm mt-1">Visão financeira e operacional da plataforma</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-brand text-black' : 'bg-surface-card border border-surface-border text-text-secondary hover:text-text-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className={`w-5 h-5 ${color}`} />
              {trend && <span className="text-xs text-neon-green font-medium">{trend}</span>}
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Games ranking */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Top 5 Jogos — {period}</h2>
        <div className="space-y-3">
          {GAME_STATS.map((g, i) => (
            <div key={g.name} className="flex items-center gap-4">
              <span className="w-6 text-center text-sm font-bold text-text-muted">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">{g.name}</span>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>{g.bets.toLocaleString('pt-BR')} apostas</span>
                    <span className="text-neon-green font-semibold">{BRL(g.ggr)}</span>
                    <span className="text-text-muted">{g.margin}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-surface-card overflow-hidden">
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${(g.ggr / GAME_STATS[0].ggr) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center">Dados simulados para demonstração. Integração com dados reais em desenvolvimento.</p>
    </div>
  )
}
