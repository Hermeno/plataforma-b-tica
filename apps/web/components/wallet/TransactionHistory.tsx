'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { formatBRL } from '@/lib/utils'
import { ArrowDownToLine, ArrowUpFromLine, Gamepad2, Gift, RefreshCw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  DEPOSIT:    { label: 'Depósito',    icon: ArrowDownToLine,  color: 'text-neon-green' },
  WITHDRAWAL: { label: 'Saque',       icon: ArrowUpFromLine,  color: 'text-neon-red' },
  BET:        { label: 'Aposta',      icon: Gamepad2,         color: 'text-text-secondary' },
  WIN:        { label: 'Ganho',       icon: Gamepad2,         color: 'text-neon-green' },
  BONUS:      { label: 'Bônus',       icon: Gift,             color: 'text-brand' },
  ROLLBACK:   { label: 'Estorno',     icon: RefreshCw,        color: 'text-neon-blue' },
}

const STATUS_BADGE: Record<string, string> = {
  COMPLETED:  'bg-neon-green/10 text-neon-green',
  PENDING:    'bg-amber-500/10 text-amber-400',
  PROCESSING: 'bg-neon-blue/10 text-neon-blue',
  FAILED:     'bg-neon-red/10 text-neon-red',
  CANCELLED:  'bg-surface-elevated text-text-muted',
}

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Concluído', PENDING: 'Pendente',
  PROCESSING: 'Processando', FAILED: 'Falhou', CANCELLED: 'Cancelado',
}

export default function TransactionHistory() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ pages: 1, total: 0 })

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/wallet/transactions?page=${p}&limit=15`)
      setData(res.data.data)
      setPagination(res.data.pagination)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-brand" />
    </div>
  )

  if (!data.length) return (
    <div className="text-center py-16 text-text-muted">
      <Gamepad2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Nenhuma transação ainda</p>
    </div>
  )

  return (
    <div className="space-y-2">
      {data.map((tx) => {
        const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.BET
        const Icon = config.icon
        const isCredit = ['DEPOSIT', 'WIN', 'BONUS', 'ROLLBACK'].includes(tx.type)

        return (
          <div key={tx.id} className="card p-4 flex items-center gap-4 hover:border-surface-elevated transition-all">
            <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center flex-shrink-0">
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{config.label}</p>
              <p className="text-xs text-text-muted truncate">
                {format(new Date(tx.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div className="text-right flex-shrink-0 space-y-1">
              <p className={`text-sm font-bold ${isCredit ? 'text-neon-green' : 'text-text-primary'}`}>
                {isCredit ? '+' : '-'}{formatBRL(tx.amount)}
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[tx.status] || ''}`}>
                {STATUS_LABEL[tx.status] || tx.status}
              </span>
            </div>
          </div>
        )
      })}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-text-muted">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
