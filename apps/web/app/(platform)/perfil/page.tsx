import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProfileTabs from '@/components/profile/ProfileTabs'

export const metadata: Metadata = { title: 'Meu Perfil' }

export default function PerfilPage() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Meu Perfil</h1>
      <Suspense>
        <ProfileTabs />
      </Suspense>
    </div>
  )
}
