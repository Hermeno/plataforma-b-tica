'use client'

import { useEffect, useState } from 'react'
import { Users, Wallet, TrendingUp, ShieldCheck, ArrowDownToLine, ArrowUpFromLine, Gamepad2, Clock, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatBRL } from '@/lib/utils'
import Link from 'next/link'

interface DashboardData {
  users: { total: number; today: number }
  financial: {
    depositToday: number; depositCountToday: number
    withdrawalToday: number; depositMonth: number
    pendingWithdrawals: number; ggr: number; ggrRate: string
  }
  gaming: { totalBets: number; totalWagered: number; totalWon: number }
  kyc: { pending: number }
}

function StatCard({ title, value, sub, icon: Icon, color, href }: any) {
  const content = (
    <div className="card p-5 hover:border-brand/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {sub && <span className="text-xs text-text-muted">{sub}</span>}
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted mt-1">{title}</p>
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-brand" />
    </div>
  )
  if (!data) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Visão geral da plataforma em tempo real</p>
      </div>

      {/* Users */}
      <div>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Usuários</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total de usuários" value={data.users.total.toLocaleString('pt-BR')} icon={Users} color="bg-neon-blue/10 text-neon-blue" href="/admin/usuarios" />
          <StatCard title="Novos hoje" value={data.users.today} icon={Users} color="bg-neon-green/10 text-neon-green" />
          <StatCard title="KYC pendente" value={data.kyc.pending} icon={ShieldCheck} color="bg-amber-500/10 text-amber-400" href="/admin/kyc" />
          <StatCard title="Saques pendentes" value={data.financial.pendingWithdrawals} icon={Clock} color="bg-neon-red/10 text-neon-red" href="/admin/saques" />
        </div>
      </div>

      {/* Financial */}
      <div>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Financeiro</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Depósitos hoje" value={formatBRL(data.financial.depositToday)} sub={`${data.financial.depositCountToday} transações`} icon={ArrowDownToLine} color="bg-neon-green/10 text-neon-green" />
          <StatCard title="Saques hoje" value={formatBRL(data.financial.withdrawalToday)} icon={ArrowUpFromLine} color="bg-neon-red/10 text-neon-red" />
          <StatCard title="Depósitos no mês" value={formatBRL(data.financial.depositMonth)} icon={Wallet} color="bg-brand/10 text-brand" />
          <StatCard title={`GGR (Hold: ${data.financial.ggrRate}%)`} value={formatBRL(data.financial.ggr)} icon={TrendingUp} color="bg-purple-500/10 text-purple-400" />
        </div>
      </div>

      {/* Gaming */}
      <div>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Jogos</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total de apostas" value={data.gaming.totalBets.toLocaleString('pt-BR')} icon={Gamepad2} color="bg-neon-blue/10 text-neon-blue" />
          <StatCard title="Total apostado" value={formatBRL(data.gaming.totalWagered)} icon={Wallet} color="bg-brand/10 text-brand" />
          <StatCard title="Total pago em prêmios" value={formatBRL(data.gaming.totalWon)} icon={TrendingUp} color="bg-neon-green/10 text-neon-green" />
        </div>
      </div>
    </div>
  )
}
