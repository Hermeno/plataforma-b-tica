import type { Metadata } from 'next'
import { Shield, Clock, TrendingDown, PhoneCall, ExternalLink, HeartHandshake } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Jogo Responsável — 3633Bet' }

const TOOLS = [
  { icon: TrendingDown, title: 'Limite de Depósito', desc: 'Defina limites diários, semanais ou mensais para depósitos.', href: '/perfil' },
  { icon: Clock, title: 'Limite de Tempo', desc: 'Receba alertas após determinado tempo de sessão.', href: '/perfil' },
  { icon: Shield, title: 'Autoexclusão', desc: 'Suspenda sua conta temporária ou permanentemente.', href: '/perfil' },
]

const SIGNS = [
  'Apostar com dinheiro destinado a despesas essenciais',
  'Mentir para familiares sobre quanto gasta com jogos',
  'Sentir necessidade de apostar valores cada vez maiores',
  'Apostar para tentar recuperar perdas anteriores',
  'Ficar irritado ou ansioso quando não consegue jogar',
  'Negligenciar trabalho, estudos ou relacionamentos por causa do jogo',
]

const ORGS = [
  { name: 'AUTOPREVINA', url: 'https://autoprevina.com.br', desc: 'Apoio gratuito para jogadores com problemas de dependência' },
  { name: 'CVV — Centro de Valorização da Vida', url: 'https://cvv.org.br', desc: 'Ligue 188 — atendimento 24h, gratuito' },
  { name: 'Jogadores Anônimos Brasil', url: 'https://jogadoresanonimos.com.br', desc: 'Grupos de apoio presenciais e online' },
]

export default function JogoResponsavelPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <HeartHandshake className="w-12 h-12 text-brand mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-text-primary">Jogo Responsável</h1>
        <p className="text-text-muted mt-2">O jogo deve ser uma forma de entretenimento, nunca uma fonte de renda ou fuga de problemas.</p>
      </div>

      {/* 18+ */}
      <div className="rounded-2xl bg-neon-red/5 border border-neon-red/20 p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neon-red/10 border-2 border-neon-red flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-extrabold text-neon-red">18+</span>
        </div>
        <div>
          <p className="font-bold text-text-primary">Proibido para menores de 18 anos</p>
          <p className="text-sm text-text-muted mt-0.5">Nossa plataforma é destinada exclusivamente a adultos. Verificamos a idade de todos os usuários.</p>
        </div>
      </div>

      {/* Tools */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Ferramentas de Controle</h2>
        <div className="grid gap-3">
          {TOOLS.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="card p-5 flex items-center gap-4 hover:border-brand/30 transition-colors group">
              <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-primary group-hover:text-brand transition-colors">{title}</p>
                <p className="text-sm text-text-muted">{desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-brand transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Warning signs */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Sinais de Alerta</h2>
        <p className="text-sm text-text-muted mb-4">Se você reconhece algum desses comportamentos, considere buscar ajuda:</p>
        <ul className="space-y-2">
          {SIGNS.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Help orgs */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Onde Buscar Ajuda</h2>
        <div className="space-y-3">
          {ORGS.map((org) => (
            <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer" className="card p-4 flex items-center gap-4 hover:border-brand/30 transition-colors group">
              <PhoneCall className="w-5 h-5 text-neon-green flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-text-primary group-hover:text-brand transition-colors text-sm">{org.name}</p>
                <p className="text-xs text-text-muted">{org.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-text-muted">
        Precisa de ajuda? <Link href="/suporte" className="text-brand hover:underline">Fale com nosso suporte</Link> — podemos ativar restrições de jogo em sua conta.
      </p>
    </div>
  )
}
