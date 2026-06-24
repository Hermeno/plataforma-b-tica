'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { formatBRL } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function SaquesPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/withdrawals/pending').then((r) => setData(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    setActionId(id)
    try {
      await api.post(`/admin/withdrawals/${id}/approve`)
      toast.success('Saque aprovado!')
      load()
    } catch { toast.error('Erro ao aprovar') }
    finally { setActionId(null) }
  }

  const reject = async (id: string) => {
    const reason = prompt('Motivo da rejeição:')
    if (!reason) return
    setActionId(id)
    try {
      await api.post(`/admin/withdrawals/${id}/reject`, { reason })
      toast.success('Saque rejeitado e saldo estornado')
      load()
    } catch { toast.error('Erro ao rejeitar') }
    finally { setActionId(null) }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-amber-400" />
        <h1 className="text-xl font-bold text-text-primary">Saques Pendentes</h1>
        <span className="badge-brand">{data.length}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
      ) : data.length === 0 ? (
        <div className="card p-10 text-center text-text-muted">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-neon-green opacity-50" />
          <p>Nenhum saque pendente</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border text-xs text-text-muted font-medium">
                <th className="text-left px-4 py-3">Usuário</th>
                <th className="text-left px-4 py-3">Valor</th>
                <th className="text-left px-4 py-3">Chave PIX</th>
                <th className="text-left px-4 py-3">Solicitado em</th>
                <th className="text-right px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {data.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-primary">{tx.user?.username}</p>
                    <p className="text-xs text-text-muted">{tx.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-text-primary">{formatBRL(tx.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-text-secondary">{tx.pixKey}</p>
                    <p className="text-[10px] text-text-muted">{tx.metadata?.pixKeyType}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {format(new Date(tx.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => approve(tx.id)}
                        disabled={actionId === tx.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/10 text-neon-green text-xs font-semibold hover:bg-neon-green/20 transition-all disabled:opacity-50"
                      >
                        {actionId === tx.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Aprovar
                      </button>
                      <button
                        onClick={() => reject(tx.id)}
                        disabled={actionId === tx.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-red/10 text-neon-red text-xs font-semibold hover:bg-neon-red/20 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rejeitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
