'use client'

import { useEffect, useState } from 'react'
import { Search, Loader2, ShieldCheck, Ban, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatBRL, maskCPF } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-neon-green/10 text-neon-green',
  PENDING_VERIFICATION: 'bg-amber-500/10 text-amber-400',
  SUSPENDED: 'bg-neon-red/10 text-neon-red',
  BANNED: 'bg-neon-red/20 text-neon-red',
  SELF_EXCLUDED: 'bg-surface-elevated text-text-muted',
}

const KYC_COLORS: Record<string, string> = {
  APPROVED: 'text-neon-green',
  PENDING: 'text-amber-400',
  NOT_STARTED: 'text-text-muted',
  REJECTED: 'text-neon-red',
}

export default function UsuariosPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const load = (page = 1, q = search) => {
    setLoading(true)
    api.get(`/admin/users?page=${page}&limit=20${q ? `&q=${q}` : ''}`)
      .then((r) => { setData(r.data.data); setPagination(r.data.pagination) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (userId: string, status: string) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status })
      toast.success('Status atualizado')
      load(pagination.page)
    } catch { toast.error('Erro ao atualizar') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">Usuários</h1>
        <span className="text-sm text-text-muted">{pagination.total.toLocaleString('pt-BR')} cadastros</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(1, search)}
          placeholder="Buscar por nome, e-mail, CPF ou username..."
          className="input-base pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-surface-border text-xs text-text-muted">
                  <th className="text-left px-4 py-3">Usuário</th>
                  <th className="text-left px-4 py-3">CPF</th>
                  <th className="text-left px-4 py-3">KYC</th>
                  <th className="text-left px-4 py-3">Saldo</th>
                  <th className="text-left px-4 py-3">Depósitos</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Cadastro</th>
                  <th className="text-right px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-elevated/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text-primary">@{user.username}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-text-secondary">{maskCPF(user.cpf)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-semibold flex items-center gap-1', KYC_COLORS[user.kycStatus])}>
                        <ShieldCheck className="w-3 h-3" />
                        {user.kycStatus === 'APPROVED' ? 'Verificado' : user.kycStatus === 'PENDING' ? 'Pendente' : 'Não iniciado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-text-primary">{formatBRL(user.balance)}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{formatBRL(user.totalDeposited)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', STATUS_COLORS[user.status] || '')}>
                        {user.status === 'ACTIVE' ? 'Ativo' : user.status === 'PENDING_VERIFICATION' ? 'Pendente' : user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">
                      {format(new Date(user.createdAt), 'dd/MM/yy', { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {user.status !== 'ACTIVE' && (
                          <button onClick={() => updateStatus(user.id, 'ACTIVE')} className="p-1.5 rounded-lg hover:bg-neon-green/10 text-neon-green transition-colors" title="Ativar">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {user.status !== 'BANNED' && (
                          <button onClick={() => updateStatus(user.id, 'BANNED')} className="p-1.5 rounded-lg hover:bg-neon-red/10 text-neon-red transition-colors" title="Banir">
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
              <span className="text-xs text-text-muted">Página {pagination.page} de {pagination.pages}</span>
              <div className="flex gap-2">
                <button onClick={() => load(pagination.page - 1)} disabled={pagination.page === 1} className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40">Anterior</button>
                <button onClick={() => load(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40">Próxima</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
