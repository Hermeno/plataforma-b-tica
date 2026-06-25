import { MessageCircle, Mail, Clock, Phone, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'Chat ao Vivo',
    desc: 'Resposta imediata com nossa equipe',
    detail: 'Disponível 24h / 7 dias',
    available: true,
    action: { label: 'Iniciar Chat', href: '#chat' },
    color: 'text-neon-green',
    bg: 'bg-neon-green/10 border-neon-green/20',
  },
  {
    icon: Mail,
    title: 'E-mail',
    desc: 'Para questões que necessitam documentação',
    detail: 'suporte@3633bet.com',
    available: true,
    action: { label: 'Enviar E-mail', href: 'mailto:suporte@3633bet.com' },
    color: 'text-brand',
    bg: 'bg-brand/10 border-brand/20',
  },
  {
    icon: Phone,
    title: 'WhatsApp',
    desc: 'Suporte via mensagem instantânea',
    detail: '+55 (11) 9 0000-0000',
    available: false,
    action: { label: 'Em breve', href: '#' },
    color: 'text-text-muted',
    bg: 'bg-surface-card border-surface-border',
  },
]

export default function SuportePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Suporte ao Cliente</h1>
        <p className="text-text-muted mt-2">Estamos aqui para ajudar. Escolha o canal de atendimento.</p>
      </div>

      {/* Availability badge */}
      <div className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-neon-green/10 border border-neon-green/20 w-fit mx-auto">
        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-sm text-neon-green font-medium">Suporte online agora</span>
        <Clock className="w-4 h-4 text-neon-green ml-1" />
        <span className="text-xs text-text-muted">Tempo médio de resposta: ~2 min</span>
      </div>

      {/* Channels */}
      <div className="grid gap-4">
        {CHANNELS.map((ch) => (
          <div key={ch.title} className={`card p-6 border ${ch.bg}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${ch.bg} border flex items-center justify-center flex-shrink-0`}>
                  <ch.icon className={`w-6 h-6 ${ch.color}`} />
                </div>
                <div>
                  <p className="font-bold text-text-primary">{ch.title}</p>
                  <p className="text-sm text-text-muted mt-0.5">{ch.desc}</p>
                  <p className={`text-xs mt-1 font-medium ${ch.color}`}>{ch.detail}</p>
                </div>
              </div>
              <a
                href={ch.action.href}
                className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                  ch.available
                    ? 'btn-brand'
                    : 'bg-surface-card text-text-muted border border-surface-border cursor-not-allowed'
                }`}
              >
                {ch.action.label}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="card p-6">
        <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand" /> Assuntos frequentes
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Problema com depósito',
            'Saque não recebido',
            'Erro em jogo',
            'Verificação de conta',
            'Bônus não creditado',
            'Acesso à conta bloqueado',
            'Reclamação',
            'Outro assunto',
          ].map((t) => (
            <button key={t} className="text-left px-3 py-2.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-sm text-text-secondary hover:text-text-primary transition-colors">
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-text-muted">
        Para dúvidas gerais, consulte nossa{' '}
        <Link href="/ajuda" className="text-brand hover:underline">Central de Ajuda</Link>
      </p>
    </div>
  )
}
