'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { api } from '@/lib/api'
import { maskCPF } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function KycPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/kyc/pending').then((r) => setData(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    setActionId(id)
    try {
      await api.post(`/admin/kyc/${id}/approve`)
      toast.success('KYC aprovado!')
      load()
    } catch { toast.error('Erro ao aprovar') }
    finally { setActionId(null) }
  }

  const reject = async (id: string) => {
    const reason = prompt('Motivo da rejeição:')
    if (!reason) return
    setActionId(id)
    try {
      await api.post(`/admin/kyc/${id}/reject`, { reason })
      toast.success('KYC rejeitado')
      load()
    } catch { toast.error('Erro ao rejeitar') }
    finally { setActionId(null) }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-text-primary">KYC Pendente</h1>
        <span className="badge-brand">{data.length}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
      ) : data.length === 0 ? (
        <div className="card p-10 text-center text-text-muted">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-neon-green opacity-50" />
          <p>Nenhum KYC pendente de análise</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((doc) => (
            <div key={doc.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{doc.user?.fullName}</p>
                  <p className="text-xs text-text-muted">@{doc.user?.username} · {maskCPF(doc.user?.cpf)}</p>
                  <p className="text-xs text-text-muted mt-1">
                    Documento: <span className="text-text-secondary font-medium">{doc.docType}</span> ·
                    Enviado: {format(new Date(doc.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {doc.frontUrl && (
                    <a href={doc.frontUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost py-1.5 px-3 text-xs gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Frente
                    </a>
                  )}
                  {doc.backUrl && (
                    <a href={doc.backUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost py-1.5 px-3 text-xs gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Verso
                    </a>
                  )}
                  {doc.selfieUrl && (
                    <a href={doc.selfieUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost py-1.5 px-3 text-xs gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Selfie
                    </a>
                  )}
                  <button
                    onClick={() => approve(doc.id)}
                    disabled={actionId === doc.id}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neon-green/10 text-neon-green text-xs font-semibold hover:bg-neon-green/20 transition-all"
                  >
                    {actionId === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Aprovar
                  </button>
                  <button
                    onClick={() => reject(doc.id)}
                    disabled={actionId === doc.id}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neon-red/10 text-neon-red text-xs font-semibold hover:bg-neon-red/20 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
