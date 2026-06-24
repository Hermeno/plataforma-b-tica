'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { validateCPF, formatCPF } from '@/lib/utils'

const schema = z.object({
  fullName: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().refine((v) => validateCPF(v), 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido').max(15),
  birthDate: z.string().refine((v) => {
    const date = new Date(v)
    const age = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return age >= 18
  }, 'Você precisa ter 18 anos ou mais'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v, 'Você deve aceitar os termos'),
  referralCode: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

const STEPS = ['Dados Pessoais', 'Acesso', 'Confirmação']

export default function RegisterForm() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  })

  const cpfValue = watch('cpf')

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    const formatted = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    setValue('cpf', formatted)
  }

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ['fullName', 'email', 'cpf', 'phone', 'birthDate'],
      ['password', 'confirmPassword'],
    ]
    const valid = await trigger(fields[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const payload = { ...data, cpf: data.cpf.replace(/\D/g, '') }
      const { data: res } = await api.post('/auth/register', payload)
      setUser(res.user)
      setToken(res.accessToken)
      toast.success('Conta criada! Bem-vindo ao Leaozinho! 🦁')
      router.push('/lobby')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
              i < step ? 'bg-neon-green text-white' : i === step ? 'bg-brand text-black' : 'bg-surface-elevated text-text-muted'
            }`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-1.5 text-xs font-medium hidden sm:block ${i === step ? 'text-text-primary' : 'text-text-muted'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-neon-green' : 'bg-surface-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0 — Dados Pessoais */}
      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Nome Completo</label>
            <input {...register('fullName')} placeholder="Seu nome completo" className="input-base" />
            {errors.fullName && <p className="text-xs text-neon-red mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">E-mail</label>
            <input {...register('email')} type="email" placeholder="seu@email.com" className="input-base" />
            {errors.email && <p className="text-xs text-neon-red mt-1">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">CPF</label>
              <input
                {...register('cpf')}
                onChange={handleCPFChange}
                value={cpfValue || ''}
                placeholder="000.000.000-00"
                className="input-base"
                maxLength={14}
              />
              {errors.cpf && <p className="text-xs text-neon-red mt-1">{errors.cpf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefone</label>
              <input {...register('phone')} placeholder="(11) 99999-9999" className="input-base" />
              {errors.phone && <p className="text-xs text-neon-red mt-1">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Data de Nascimento</label>
            <input {...register('birthDate')} type="date" className="input-base" />
            {errors.birthDate && <p className="text-xs text-neon-red mt-1">{errors.birthDate.message}</p>}
          </div>
        </div>
      )}

      {/* Step 1 — Senha */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Senha</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                className="input-base pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-neon-red mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirmar Senha</label>
            <input {...register('confirmPassword')} type="password" placeholder="Repita a senha" className="input-base" />
            {errors.confirmPassword && <p className="text-xs text-neon-red mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Código de Indicação (opcional)</label>
            <input {...register('referralCode')} placeholder="Código de um amigo" className="input-base" />
          </div>
        </div>
      )}

      {/* Step 2 — Termos */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-4 bg-brand/5 border-brand/20">
            <p className="text-sm text-text-secondary">
              Confirme que você tem <strong className="text-text-primary">18 anos ou mais</strong>, reside no Brasil
              e está de acordo com os <a href="/termos" className="text-brand underline">Termos de Uso</a> e
              a <a href="/privacidade" className="text-brand underline">Política de Privacidade</a>.
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input {...register('terms')} type="checkbox" className="mt-1 w-4 h-4 accent-brand rounded" />
            <span className="text-sm text-text-secondary">
              Li e aceito os Termos de Uso, a Política de Privacidade e confirmo ter 18 anos ou mais.
            </span>
          </label>
          {errors.terms && <p className="text-xs text-neon-red">{errors.terms.message}</p>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost flex-1 py-3">
            Voltar
          </button>
        )}
        {step < 2 ? (
          <button type="button" onClick={nextStep} className="btn-brand flex-1 py-3">
            Continuar
          </button>
        ) : (
          <button type="submit" disabled={isLoading} className="btn-brand flex-1 py-3">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando conta...</> : 'Criar Minha Conta 🦁'}
          </button>
        )}
      </div>
    </form>
  )
}
