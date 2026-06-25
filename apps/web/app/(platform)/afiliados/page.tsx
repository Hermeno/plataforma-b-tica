'use client'

import { useAuthStore } from '@/store/authStore'
import { Copy, Users, DollarSign, Gift, CheckCircle2, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AfiliadosPage() {
  const { user } = useAuthStore()
  const referralCode = (user as any)?.referralCode ?? '—'
  const referralLink = `https://3633bet.com/cadastro?ref=${referralCode}`

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado!`)
  }

  const steps = [
    { n: '1', title: 'Compartilhe seu link', desc: 'Envie seu link exclusivo para amigos e familiares.' },
    { n: '2', title: 'Amigo se cadastra', desc: 'Seu amigo cria a conta e faz um depósito mínimo de R$100.' },
    { n: '3', title: 'Amigo aposta R$300', desc: 'Após atingir R$300 em apostas válidas, o bônus é liberado.' },
    { n: '4', title: 'Você recebe R$50', desc: 'R$50 são creditados automaticamente na sua conta.' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Programa de Afiliados</h1>
        <p className="text-text-muted mt-2">Indique amigos e ganhe R$50 por cada um que depositar e apostar</p>
      </div>

      {/* Banner */}
      <div className="rounded-2xl bg-brand-gradient p-8 text-center text-black">
        <p className="text-5xl font-extrabold">R$50</p>
        <p className="text-lg font-semibold mt-1">por indicação aprovada</p>
        <p className="text-sm mt-2 opacity-80">Sem limite de indicações</p>
      </div>

      {/* Seu link */}
      {user && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2"><Share2 className="w-5 h-5 text-brand" /> Seu Link de Indicação</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-muted mb-1">Código</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-surface-card border border-surface-border rounded-lg px-4 py-2.5 text-brand font-mono text-sm">{referralCode}</code>
                <button onClick={() => copy(referralCode, 'Código')} className="btn-brand py-2.5 px-4 text-sm flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Link completo</p>
              <div className="flex items-center gap-2">
                <input readOnly value={referralLink} className="input-base text-xs flex-1" />
                <button onClick={() => copy(referralLink, 'Link')} className="btn-ghost py-2.5 px-4 text-sm flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Como funciona */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-6">Como funciona</h2>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center flex-shrink-0">
                <span className="text-brand font-bold text-sm">{s.n}</span>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">{s.title}</p>
                <p className="text-text-muted text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Requisitos</h2>
        <ul className="space-y-2">
          {[
            'Amigo deve depositar no mínimo R$100',
            'Amigo deve apostar no mínimo R$300 em jogos válidos',
            'Conta do amigo deve estar ativa e verificada',
            'Sem limite de indicações — ganhe quantas quiser',
            'Bônus creditado em até 24h após elegibilidade',
          ].map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats placeholder */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Indicados', value: '0' },
          { icon: DollarSign, label: 'Ganho total', value: 'R$0,00' },
          { icon: Gift, label: 'Pendentes', value: '0' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 text-center">
            <Icon className="w-5 h-5 text-brand mx-auto mb-2" />
            <p className="text-xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
