'use client'

import { useState } from 'react'
import { Search, Plus, ToggleLeft, ToggleRight, Star, Flame } from 'lucide-react'

const MOCK_GAMES = [
  { id: 1, name: 'Fortune Tiger', provider: 'PG Soft', category: 'SLOTS', active: true, featured: true, isNew: false, rtp: 96.7 },
  { id: 2, name: 'Fortune Ox', provider: 'PG Soft', category: 'SLOTS', active: true, featured: true, isNew: false, rtp: 96.8 },
  { id: 3, name: 'Fortune Mouse', provider: 'PG Soft', category: 'SLOTS', active: true, featured: false, isNew: true, rtp: 96.9 },
  { id: 4, name: 'Aviator', provider: 'Spribe', category: 'CRASH', active: true, featured: true, isNew: false, rtp: 97.0 },
  { id: 5, name: 'Mines', provider: 'Spribe', category: 'CRASH', active: true, featured: false, isNew: false, rtp: 97.0 },
  { id: 6, name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'SLOTS', active: false, featured: false, isNew: false, rtp: 96.5 },
  { id: 7, name: 'Gates of Olympus', provider: 'Pragmatic', category: 'SLOTS', active: true, featured: true, isNew: false, rtp: 96.5 },
  { id: 8, name: 'Dragon Tiger', provider: 'JDB', category: 'TABLE', active: true, featured: false, isNew: true, rtp: 96.3 },
]

const CATS = ['Todos', 'SLOTS', 'CRASH', 'TABLE', 'FISH', 'SPORT', 'LIVE_CASINO']

export default function AdminJogosPage() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('Todos')
  const [games, setGames] = useState(MOCK_GAMES)

  const toggle = (id: number, field: 'active' | 'featured') => {
    setGames((prev) => prev.map((g) => g.id === id ? { ...g, [field]: !g[field] } : g))
  }

  const filtered = games.filter((g) =>
    (cat === 'Todos' || g.category === cat) &&
    (!search || g.name.toLowerCase().includes(search.toLowerCase()) || g.provider.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gerenciar Jogos</h1>
          <p className="text-text-muted text-sm mt-1">{games.filter((g) => g.active).length} jogos ativos de {games.length} total</p>
        </div>
        <button className="btn-brand py-2.5 px-4 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Jogo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou provedora..." className="input-base pl-10 py-2.5" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${cat === c ? 'bg-brand text-black' : 'bg-surface-card border border-surface-border text-text-secondary hover:text-text-primary'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left px-4 py-3 text-text-muted font-medium">Jogo</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">Provedora</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">Categoria</th>
                <th className="text-center px-4 py-3 text-text-muted font-medium">RTP</th>
                <th className="text-center px-4 py-3 text-text-muted font-medium">Destaque</th>
                <th className="text-center px-4 py-3 text-text-muted font-medium">Ativo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-surface-border/50 hover:bg-surface-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{g.name}</span>
                      {g.isNew && <span className="px-1.5 py-0.5 rounded text-xs bg-neon-green/20 text-neon-green font-medium">NOVO</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{g.provider}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-xs">{g.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-text-secondary">{g.rtp}%</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(g.id, 'featured')} className={`transition-colors ${g.featured ? 'text-amber-400' : 'text-text-muted hover:text-amber-400'}`}>
                      <Star className={`w-4 h-4 ${g.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(g.id, 'active')} className={g.active ? 'text-neon-green' : 'text-text-muted'}>
                      {g.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-text-muted text-sm">Nenhum jogo encontrado</div>
          )}
        </div>
      </div>
    </div>
  )
}
