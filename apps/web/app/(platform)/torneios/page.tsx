import { Trophy, Clock, Users, Lock } from 'lucide-react'

const UPCOMING = [
  { name: 'Torneio Fortune Tiger', prize: 'R$5.000', players: 128, starts: '01/07/2026', status: 'Inscrições abertas' },
  { name: 'Campeonato Aviator', prize: 'R$10.000', players: 64, starts: '05/07/2026', status: 'Em breve' },
  { name: 'Copa Slots Verão', prize: 'R$2.500', players: 256, starts: '10/07/2026', status: 'Em breve' },
]

export default function TorneiosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Torneios</h1>
        <p className="text-text-muted mt-2">Compita com outros jogadores e ganhe prêmios em dinheiro</p>
      </div>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-brand/20 via-surface-card to-surface border border-brand/20 p-8 text-center">
        <Trophy className="w-16 h-16 text-brand mx-auto mb-4" />
        <p className="text-3xl font-extrabold text-text-primary">R$17.500</p>
        <p className="text-text-muted mt-1">em prêmios este mês</p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-brand/10 border border-brand/20">
          <Clock className="w-4 h-4 text-brand" />
          <span className="text-sm text-brand font-medium">Próximo torneio em 6 dias</span>
        </div>
      </div>

      {/* Upcoming tournaments */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Próximos Torneios</h2>
        <div className="space-y-3">
          {UPCOMING.map((t) => (
            <div key={t.name} className="card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{t.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-muted flex items-center gap-1"><Users className="w-3 h-3" /> Até {t.players} jogadores</span>
                    <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {t.starts}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-brand">{t.prize}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  t.status === 'Inscrições abertas'
                    ? 'bg-neon-green/10 text-neon-green'
                    : 'bg-surface-card text-text-muted border border-surface-border'
                }`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon banner */}
      <div className="card p-8 text-center border-dashed">
        <Lock className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-lg font-bold text-text-primary">Sistema de Torneios em Desenvolvimento</p>
        <p className="text-text-muted text-sm mt-2">Em breve você poderá se inscrever e competir em tempo real.<br />Fique de olho nas notificações!</p>
      </div>
    </div>
  )
}
