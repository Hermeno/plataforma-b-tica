'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const BANNERS = [
  {
    id: 1,
    title: 'Bônus de Boas-vindas',
    subtitle: '100% até R$ 500 no primeiro depósito',
    cta: 'Resgatar Bônus',
    href: '/cadastro',
    bg: 'from-amber-900/80 via-amber-800/60 to-surface',
    accent: 'text-brand',
  },
  {
    id: 2,
    title: 'Novos Jogos da PP',
    subtitle: 'Pragmatic Play com os melhores slots do momento',
    cta: 'Jogar Agora',
    href: '/lobby?provider=pp',
    bg: 'from-purple-900/80 via-purple-800/60 to-surface',
    accent: 'text-purple-400',
  },
  {
    id: 3,
    title: 'Fish Games Ao Vivo',
    subtitle: 'JDB Gaming — diversão e prêmios em tempo real',
    cta: 'Explorar',
    href: '/lobby?cat=fish',
    bg: 'from-blue-900/80 via-blue-800/60 to-surface',
    accent: 'text-blue-400',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length)
  const next = () => setCurrent((c) => (c + 1) % BANNERS.length)
  const banner = BANNERS[current]

  return (
    <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-xl overflow-hidden mb-6 border border-surface-border">
      <div className={cn('absolute inset-0 bg-gradient-to-r transition-all duration-700', banner.bg)} />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10">
        <span className={cn('text-xs font-semibold uppercase tracking-widest mb-1', banner.accent)}>
          Leaozinho Casino
        </span>
        <h2 className="text-xl sm:text-3xl font-bold text-text-primary leading-tight max-w-sm">
          {banner.title}
        </h2>
        <p className="text-sm text-text-secondary mt-1 max-w-xs">{banner.subtitle}</p>
        <Link href={banner.href} className="btn-brand mt-4 w-fit py-2 px-5 text-sm">
          {banner.cta}
        </Link>
      </div>

      {/* Controls */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn('w-2 h-2 rounded-full transition-all', i === current ? 'bg-brand w-5' : 'bg-white/30 hover:bg-white/50')}
          />
        ))}
      </div>
    </div>
  )
}
