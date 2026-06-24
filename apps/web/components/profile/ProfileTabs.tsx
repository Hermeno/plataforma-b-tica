'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { User, ShieldCheck, Settings, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import PersonalInfo from './PersonalInfo'
import KycVerification from './KycVerification'
import ResponsibleGaming from './ResponsibleGaming'
import AccountSettings from './AccountSettings'

const TABS = [
  { id: 'dados', label: 'Dados Pessoais', icon: User },
  { id: 'kyc', label: 'Verificação', icon: ShieldCheck },
  { id: 'responsavel', label: 'Jogo Responsável', icon: AlertTriangle },
  { id: 'seguranca', label: 'Segurança', icon: Settings },
]

export default function ProfileTabs() {
  const params = useSearchParams()
  const [active, setActive] = useState(params.get('aba') || 'dados')

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-surface-border mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap',
              active === id
                ? 'border-brand text-brand'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {active === 'dados' && <PersonalInfo />}
        {active === 'kyc' && <KycVerification />}
        {active === 'responsavel' && <ResponsibleGaming />}
        {active === 'seguranca' && <AccountSettings />}
      </div>
    </div>
  )
}
