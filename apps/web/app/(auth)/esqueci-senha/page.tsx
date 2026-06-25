'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Phone, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const schema = z.object({
  phone: z.string().min(10, 'Telefone inválido'),
})

type FormData = z.infer<typeof schema>

export default function EsqueciSenhaPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    let formatted = raw
    if (raw.length > 6) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`
    else if (raw.length > 2) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`
    setValue('phone', formatted)
  }

  const onSubmit = async (_data: FormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <span className="font-display text-3xl text-gradient-brand tracking-wide">3633BET</span>
          </Link>
        </div>

        <div className="card p-6 shadow-card">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-neon-green mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text-primary">SMS Enviado!</h2>
              <p className="text-text-muted text-sm mt-2">
                Se o telefone informado estiver cadastrado, você receberá um SMS com o código de recuperação em instantes.
              </p>
              <p className="text-xs text-text-muted mt-4">Não recebeu? Aguarde 2 minutos e tente novamente.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setSent(false)} className="btn-ghost flex-1 py-2.5 text-sm">
                  Tentar novamente
                </button>
                <Link href="/login" className="btn-brand flex-1 py-2.5 text-sm text-center">
                  Voltar ao login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-text-primary">Recuperar Senha</h1>
                <p className="text-text-muted text-sm mt-1">Informe seu telefone para receber o código de recuperação por SMS.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1" />Telefone cadastrado
                  </label>
                  <input
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="input-base"
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="text-xs text-neon-red mt-1">{errors.phone.message}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-brand w-full py-3 flex items-center justify-center gap-2">
                  {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                  {loading ? 'Enviando...' : 'Enviar Código SMS'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          <Link href="/login" className="text-brand hover:text-brand-light font-medium flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
