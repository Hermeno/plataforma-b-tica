'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const SUBJECTS = [
  'Problema com depósito',
  'Problema com saque',
  'Erro em jogo',
  'Verificação de conta (KYC)',
  'Bônus não creditado',
  'Sugestão',
  'Outro',
]

export default function ContatoPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.subject || !form.message) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success('Mensagem enviada com sucesso!')
  }

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Mensagem Enviada!</h2>
        <p className="text-text-muted mt-2">Nossa equipe responderá em até 24h. Obrigado pelo contato.</p>
        <button onClick={() => setSent(false)} className="btn-brand mt-6 px-6 py-2.5">Enviar outra mensagem</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Fale Conosco</h1>
        <p className="text-text-muted mt-2">Envie sua mensagem e respondemos em até 24h</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Nome completo</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-base"
                placeholder="(11) 99999-9999"
                type="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Assunto</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input-base"
            >
              <option value="">Selecione o assunto</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Mensagem</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="input-base resize-none"
              placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-brand w-full py-3 flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-text-muted">
        Para atendimento imediato, acesse o <a href="/suporte" className="text-brand hover:underline">Chat ao Vivo</a>
      </p>
    </div>
  )
}
