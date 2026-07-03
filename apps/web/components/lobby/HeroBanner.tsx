'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const BANNERS = [
  {
    id: 1,
    image: '/banner-indicacao.png',
    alt: 'Convide Amigos e Ganhe R$50',
    href: '/afiliados',
  },
  {
    id: 2,
    image: '/banner-deposito.png',
    alt: '10% a mais sobre cada depósito',
    href: '/carteira?aba=deposito',
  },
  {
    id: 3,
    image: '/banner-retorno.png',
    alt: '5% de Retorno Semanal',
    href: '/bonus',
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

  return (
    <div className="relative w-full rounded-xl overflow-hidden mb-6 border border-surface-border bg-surface-card">
      {/* Slides */}
      <div className="relative w-full" style={{ aspectRatio: '970/486' }}>
        {BANNERS.map((banner, i) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              className="object-cover object-center"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </Link>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={(e) => { e.preventDefault(); prev() }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next() }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === current ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/60'
            )}
          />
        ))}
      </div>
    </div>
  )
}
