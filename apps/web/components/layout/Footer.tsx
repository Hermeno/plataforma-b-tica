import Link from 'next/link'
import { Shield, Lock, HeartHandshake } from 'lucide-react'

const LINKS = {
  Plataforma: [
    { label: 'Lobby de Jogos', href: '/lobby' },
    { label: 'Bônus e Promoções', href: '/bonus' },
    { label: 'Afiliados', href: '/afiliados' },
    { label: 'Torneios', href: '/torneios' },
  ],
  Suporte: [
    { label: 'Central de Ajuda', href: '/ajuda' },
    { label: 'Chat ao vivo', href: '/suporte' },
    { label: 'Contato', href: '/contato' },
    { label: 'Reclamações', href: '/reclamacoes' },
  ],
  Legal: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Jogo Responsável', href: '/jogo-responsavel' },
    { label: 'Política de Bônus', href: '/termos-bonus' },
  ],
}

const PROVIDERS = ['Pragmatic Play', 'PG Soft', 'JDB Gaming', 'Funky Games', 'Spribe', 'Habanero']

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center">
                <span className="text-black font-display text-lg">L</span>
              </div>
              <span className="font-display text-xl text-gradient-brand">LEAOZINHO</span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Plataforma de cassino online regulamentada para maiores de 18 anos.
              Jogue com responsabilidade.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Shield className="w-4 h-4 text-neon-green" />
              <span className="text-xs text-neon-green font-medium">Licença MF/SPA — Brasil</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">{title}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Providers */}
        <div className="border-t border-surface-border pt-6 pb-6">
          <p className="text-xs text-text-muted mb-3">Provedoras de jogos</p>
          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map((p) => (
              <span key={p} className="px-3 py-1 rounded-lg bg-surface-card border border-surface-border text-xs text-text-muted">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Responsible gaming badges */}
        <div className="border-t border-surface-border pt-6 pb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-surface-border">
              <span className="text-sm font-bold text-neon-red">18+</span>
              <span className="text-xs text-text-muted">Apenas maiores de 18 anos</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-surface-border">
              <HeartHandshake className="w-4 h-4 text-neon-green" />
              <a href="https://autoprevina.com.br" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-neon-green transition-colors">
                AUTOPREVINA
              </a>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-surface-border">
              <Lock className="w-4 h-4 text-brand" />
              <span className="text-xs text-text-muted">SSL 256-bit</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-surface-border pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} Leaozinho. Todos os direitos reservados.
              CNPJ: 00.000.000/0001-00
            </p>
            <p className="text-xs text-text-muted">
              Jogue com responsabilidade. O jogo pode ser viciante.
              Ligue <strong className="text-text-secondary">0800 000 0000</strong> (gratuito).
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
