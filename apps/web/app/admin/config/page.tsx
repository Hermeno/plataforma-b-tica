'use client'

import { useState } from 'react'
import { Save, RefreshCw, Shield, DollarSign, Gift, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminConfigPage() {
  const [saving, setSaving] = useState(false)

  const [config, setConfig] = useState({
    minDeposit: '20',
    maxDeposit: '50000',
    minWithdraw: '20',
    maxWithdraw: '10000',
    welcomeBonus: '40',
    welcomeRollover: '150',
    depositBonusPct: '10',
    referralBonus: '50',
    referralMinDeposit: '100',
    referralMinWager: '300',
    maintenanceMode: false,
    newRegistrations: true,
    depositsEnabled: true,
    withdrawalsEnabled: true,
  })

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Configurações salvas!')
  }

  const field = (label: string, key: keyof typeof config, prefix = '') => (
    <div key={key}>
      <label className="block text-xs font-medium text-text-secondary mb-1">{label}</label>
      <div className="flex items-center">
        {prefix && <span className="px-3 py-2.5 bg-surface border border-r-0 border-surface-border rounded-l-lg text-sm text-text-muted">{prefix}</span>}
        <input
          type="number"
          value={config[key] as string}
          onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
          className={`input-base text-sm ${prefix ? 'rounded-l-none' : ''}`}
        />
      </div>
    </div>
  )

  const toggle = (label: string, key: keyof typeof config, desc: string) => (
    <div key={key} className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted">{desc}</p>
      </div>
      <button
        onClick={() => setConfig({ ...config, [key]: !config[key] })}
        className={`relative w-11 h-6 rounded-full transition-colors ${config[key] ? 'bg-brand' : 'bg-surface-card border border-surface-border'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${config[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
          <p className="text-text-muted text-sm mt-1">Parâmetros operacionais da plataforma</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-brand py-2.5 px-4 text-sm flex items-center gap-2">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Depósitos e Saques */}
      <div className="card p-6">
        <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-brand" /> Limites Financeiros</h2>
        <div className="grid grid-cols-2 gap-4">
          {field('Depósito mínimo', 'minDeposit', 'R$')}
          {field('Depósito máximo', 'maxDeposit', 'R$')}
          {field('Saque mínimo', 'minWithdraw', 'R$')}
          {field('Saque máximo', 'maxWithdraw', 'R$')}
        </div>
      </div>

      {/* Bônus */}
      <div className="card p-6">
        <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2"><Gift className="w-5 h-5 text-brand" /> Configurações de Bônus</h2>
        <div className="grid grid-cols-2 gap-4">
          {field('Bônus boas-vindas', 'welcomeBonus', 'R$')}
          {field('Rollover boas-vindas', 'welcomeRollover', 'R$')}
          {field('Bônus de depósito', 'depositBonusPct', '%')}
          {field('Bônus de indicação', 'referralBonus', 'R$')}
          {field('Depósito mín. para indicação', 'referralMinDeposit', 'R$')}
          {field('Apostas mín. para indicação', 'referralMinWager', 'R$')}
        </div>
      </div>

      {/* Controles operacionais */}
      <div className="card p-6">
        <h2 className="font-bold text-text-primary mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-brand" /> Controles Operacionais</h2>
        <div>
          {toggle('Modo manutenção', 'maintenanceMode', 'Exibe página de manutenção para usuários')}
          {toggle('Novos cadastros', 'newRegistrations', 'Permite criação de novas contas')}
          {toggle('Depósitos', 'depositsEnabled', 'Habilita processamento de depósitos PIX')}
          {toggle('Saques', 'withdrawalsEnabled', 'Habilita processamento de saques PIX')}
        </div>
      </div>

      {/* Notificações */}
      <div className="card p-6">
        <h2 className="font-bold text-text-primary mb-3 flex items-center gap-2"><Bell className="w-5 h-5 text-brand" /> E-mail de alertas</h2>
        <input type="email" defaultValue="admin@3633bet.com" className="input-base text-sm" placeholder="E-mail para alertas operacionais" />
        <p className="text-xs text-text-muted mt-1.5">Receba alertas de saques acima do limite, erros críticos e novos registros suspeitos.</p>
      </div>
    </div>
  )
}
