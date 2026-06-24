'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWalletStore } from '@/store/walletStore'
import { formatBRL } from '@/lib/utils'
import PixDepositForm from './PixDepositForm'
import WithdrawForm from './WithdrawForm'
import TransactionHistory from './TransactionHistory'

const TABS = [
  { id: 'deposito', label: 'Depositar', icon: ArrowDownToLine },
  { id: 'saque', label: 'Sacar', icon: ArrowUpFromLine },
  { id: 'extrato', label: 'Extrato', icon: Clock },
]

export default function WalletTabs() {
  const params = useSearchParams()
  const [active, setActive] = useState(params.get('aba') || 'deposito')
  const { balance, bonusBalance } = useWalletStore()

  return (
    <div className="space-y-6">
      {/* Balance cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" /> Saldo Real
          </p>
          <p className="text-2xl font-bold text-text-primary">{formatBRL(balance)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" /> Saldo Bônus
          </p>
          <p className="text-2xl font-bold text-brand">{formatBRL(bonusBalance)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px',
              active === id
                ? 'border-brand text-brand'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {active === 'deposito' && <PixDepositForm />}
        {active === 'saque' && <WithdrawForm />}
        {active === 'extrato' && <TransactionHistory />}
      </div>
    </div>
  )
}
