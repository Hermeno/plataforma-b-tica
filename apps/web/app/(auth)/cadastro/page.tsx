import type { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Criar Conta' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-brand-gradient shadow-brand-lg" />
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-4">Criar sua conta</h1>
          <p className="text-text-muted text-sm mt-1">Cadastre-se e ganhe 100% até R$ 500 de bônus</p>
        </div>

        <div className="card p-6 shadow-card">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-brand hover:text-brand-light font-semibold transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
