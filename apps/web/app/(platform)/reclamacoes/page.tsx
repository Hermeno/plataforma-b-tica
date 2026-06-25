'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPES = [
  'Depósito não processado',
  'Saque recusado ou atrasado',
  'Bônus não creditado ou cancelado indevidamente',
  'Resultado de jogo contestado',
  'Conta bloqueada injustamente',
  'Dados pessoais / privacidade',
  'Outra reclamação',
]

export default function ReclamacoesPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ type: '', protocol: '', description: '', phone: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type || !form.description || !form.phone) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    const protocol = 'REC-' + Date.now().toString().slice(-8)
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Reclamação Registrada</h2>
        <p className="text-text-muted mt-2">Seu protocolo de atendimento:</p>
        <div className="my-4 px-6 py-3 rounded-xl bg-brand/10 border border-brand/20 inline-block">
          <p className="text-xl font-mono font-bold text-brand">{protocol}</p>
        </div>
        <p className="text-sm text-text-muted">Nossa equipe analisará sua reclamação em até 5 dias úteis e retornará pelo telefone informado.</p>
        <button onClick={() => setSent(false)} className="btn-ghost mt-6 px-6 py-2.5">Nova reclamação</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Reclamações</h1>
        <p className="text-text-muted mt-2">Registre sua reclamação formal. Respondemos em até 5 dias úteis.</p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-text-secondary">
          <p className="font-semibold text-amber-400 mb-0.5">Antes de registrar</p>
          <p>Verifique se já tentou resolver através do <a href="/suporte" className="text-brand hover:underline">suporte ao vivo</a>. Para reclamações externas, você pode contatar a <a href="https://consumidor.gov.br" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline inline-flex items-center gap-0.5">Consumidor.gov.br <ExternalLink className="w-3 h-3" /></a>.</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Tipo de reclamação *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-base">
              <option value="">Selecione</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Número de protocolo anterior (opcional)</label>
            <input
              value={form.protocol}
              onChange={(e) => setForm({ ...form, protocol: e.target.value })}
              className="input-base"
              placeholder="Ex: SUP-12345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefone para contato *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-base"
              placeholder="(11) 99999-9999"
              type="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Descrição detalhada *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className="input-base resize-none"
              placeholder="Descreva em detalhes o que aconteceu: data, valores envolvidos, o que foi prometido e o que ocorreu de errado..."
            />
            <p className="text-xs text-text-muted mt-1">{form.description.length}/1000 caracteres</p>
          </div>

          <button type="submit" disabled={loading} className="btn-brand w-full py-3 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {loading ? 'Registrando...' : 'Registrar Reclamação'}
          </button>
        </form>
      </div>
    </div>
  )
}
