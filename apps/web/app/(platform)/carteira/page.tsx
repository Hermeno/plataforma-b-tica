import type { Metadata } from 'next'
import { Suspense } from 'react'
import WalletTabs from '@/components/wallet/WalletTabs'

export const metadata: Metadata = { title: 'Carteira' }

export default function CarteiraPage() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Minha Carteira</h1>
      <Suspense>
        <WalletTabs />
      </Suspense>
    </div>
  )
}
