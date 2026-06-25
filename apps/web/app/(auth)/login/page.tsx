import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <span className="font-display text-3xl text-gradient-brand tracking-wide">3633BET</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-4">Bem-vindo de volta!</h1>
          <p className="text-text-muted text-sm mt-1">Entre na sua conta 3633Bet</p>
        </div>

        <div className="card p-6 shadow-card">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-brand hover:text-brand-light font-semibold transition-colors">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  )
}
