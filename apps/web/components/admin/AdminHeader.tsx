'use client'

import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function AdminHeader() {
  const { user } = useAuthStore()
  return (
    <header className="h-14 border-b border-surface-border bg-surface/90 backdrop-blur flex items-center justify-between px-6 flex-shrink-0">
      <p className="text-sm text-text-muted">
        Bem-vindo, <span className="text-text-primary font-semibold">{user?.username}</span>
      </p>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-surface-card text-text-muted">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
