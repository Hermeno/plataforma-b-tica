'use client'

import { useAuthStore } from '@/store/authStore'
import { maskCPF, formatPhone } from '@/lib/utils'
import { Mail, Phone, CreditCard, Calendar, User } from 'lucide-react'

export default function PersonalInfo() {
  const { user } = useAuthStore()
  if (!user) return null

  const fields = [
    { label: 'Nome completo', value: user.fullName, icon: User },
    { label: 'E-mail', value: user.email, icon: Mail },
    { label: 'CPF', value: maskCPF(user.cpf), icon: CreditCard },
  ]

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center shadow-brand">
          <span className="text-black text-2xl font-bold">
            {user.username?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-lg font-bold text-text-primary">@{user.username}</p>
          <div className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            user.kycStatus === 'APPROVED' ? 'bg-neon-green/10 text-neon-green' : 'bg-amber-500/10 text-amber-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${user.kycStatus === 'APPROVED' ? 'bg-neon-green' : 'bg-amber-400'}`} />
            {user.kycStatus === 'APPROVED' ? 'Conta verificada' : 'Verificação pendente'}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="card divide-y divide-surface-border">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 p-4">
            <Icon className="w-4 h-4 text-text-muted flex-shrink-0" />
            <div>
              <p className="text-xs text-text-muted">{label}</p>
              <p className="text-sm font-medium text-text-primary mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted text-center">
        Para alterar dados pessoais, entre em contato com o suporte.
      </p>
    </div>
  )
}
