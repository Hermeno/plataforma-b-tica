'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useWalletStore } from '@/store/walletStore'

const schema = z.object({
  login: z.string().min(3, 'Informe seu e-mail ou CPF'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const { setBalance } = useWalletStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const { data: res } = await api.post('/auth/login', data)
      setUser(res.user)
      setToken(res.accessToken)
      setBalance(res.wallet.balance)
      toast.success(`Bem-vindo, ${res.user.username}!`)
      router.push('/lobby')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Credenciais inválidas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          E-mail ou CPF
        </label>
        <input
          {...register('login')}
          type="text"
          placeholder="seu@email.com ou 000.000.000-00"
          className="input-base"
          autoComplete="username"
        />
        {errors.login && (
          <p className="text-xs text-neon-red mt-1">{errors.login.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-text-secondary">Senha</label>
          <a href="/esqueci-senha" className="text-xs text-brand hover:text-brand-light transition-colors">
            Esqueci minha senha
          </a>
        </div>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="input-base pr-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-neon-red mt-1">{errors.password.message}</p>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn-brand w-full py-3 mt-2">
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  )
}
