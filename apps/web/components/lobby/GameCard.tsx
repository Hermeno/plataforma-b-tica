'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameCardProps {
  id: string
  slug: string
  name: string
  provider: string
  thumbnail: string
  isNew?: boolean
  isFeatured?: boolean
  hasDemo?: boolean
  rtp?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function GameCard({
  slug,
  name,
  provider,
  thumbnail,
  isNew,
  isFeatured,
  hasDemo,
  rtp,
  size = 'md',
}: GameCardProps) {
  const sizeClasses = {
    sm: 'aspect-[3/4]',
    md: 'aspect-[3/4]',
    lg: 'aspect-[4/3]',
  }

  return (
    <div className="game-card group animate-fade-in">
      <div className={cn('relative w-full', sizeClasses[size])}>
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isNew && <span className="badge-new">NOVO</span>}
          {isFeatured && <span className="badge-brand">★</span>}
        </div>

        {/* Hover overlay */}
        <div className="game-card-overlay z-10">
          <div className="flex flex-col items-center gap-2 w-full px-3">
            <Link
              href={`/game/${slug}`}
              className="btn-brand w-full py-2 text-xs justify-center"
            >
              <Play className="w-3.5 h-3.5" />
              Jogar
            </Link>
            {hasDemo && (
              <Link
                href={`/game/${slug}?demo=true`}
                className="btn-ghost w-full py-2 text-xs justify-center"
              >
                Demo Grátis
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="p-2 bg-surface-card">
        <p className="text-xs font-semibold text-text-primary truncate">{name}</p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[11px] text-text-muted">{provider}</p>
          {rtp && (
            <p className="text-[11px] text-neon-green font-medium">RTP {rtp}%</p>
          )}
        </div>
      </div>
    </div>
  )
}
