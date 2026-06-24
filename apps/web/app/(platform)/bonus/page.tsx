import type { Metadata } from 'next'
import BonusPage from '@/components/bonus/BonusPage'

export const metadata: Metadata = { title: 'Bônus e Promoções' }

export default function Page() {
  return <BonusPage />
}
