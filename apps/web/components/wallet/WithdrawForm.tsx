'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useWalletStore } from '@/store/walletStore'
import { formatBRL } from '@/lib/utils'

const PIX_KEY_TYPES = [
  { value: 'CPF', label: 'CPF' },
  { value: 'EMAIL', label: 'E-mail' },
  { value: 'PHONE', label: 'Telefone' },
  { value: 'RANDOM', label: 'Chave Aleatória' },
]

const schema = z.object({
  amount: z.number().min(20, 'Mínimo R$ 20').max(50000, 'Máximo R$ 50.000'),
  pixKeyType: z.string().min(1),
  pixKey: z.string().min(5, 'Chave PIX inválida'),
})

type FormData = z.infer<typeof schema>

export default function WithdrawForm() {
  const { balance, decrementBalance } = useWalletStore()
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { pixKeyType: 'CPF' },
  })

  const pixKeyType = watch('pixKeyType')
  const amount = watch('amount')

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await api.post('/wallet/withdraw', data)
      decrementBalance(data.amount)
      setSuccess(true)
      toast.success('Solicitação de saque enviada!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao solicitar saque')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-10 animate-fade-in space-y-4">
        <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-neon-green" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Saque solicitado!</h3>
        <p className="text-text-secondary text-sm max-w-xs mx-auto">
          Seu saque de <strong className="text-text-primary">{formatBRL(amount)}</strong> será processado em até 24 horas via PIX.
        </p>
        <button onClick={() => setSuccess(false)} className="btn-ghost px-6 py-2.5 text-sm mx-auto">
          Novo saque
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Balance info */}
      <div className="card p-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">Saldo disponível</p>
        <p className="text-lg font-bold text-text-primary">{formatBRL(balance)}</p>
      </div>

      {/* KYC warning */}
      <div className="card p-3 bg-amber-500/5 border-amber-500/20 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary">
          Saque <strong className="text-text-primary">somente para chave PIX do seu próprio CPF</strong>. KYC aprovado é obrigatório.
        </p>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Valor do saque</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">R$</span>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            placeholder="0,00"
            min={20}
            max={balance}
            className="input-base pl-10 text-lg font-semibold"
          />
        </div>
        {errors.amount && <p className="text-xs text-neon-red mt-1">{errors.amount.message}</p>}
        <p className="text-xs text-text-muted mt-1">Mín: R$ 20,00 • Máx: {formatBRL(Math.min(balance, 50000))}</p>
      </div>

      {/* PIX Key Type */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Tipo de chave PIX</label>
        <select {...register('pixKeyType')} className="input-base">
          {PIX_KEY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* PIX Key */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Chave PIX</label>
        <input
          {...register('pixKey')}
          type="text"
          placeholder={
            pixKeyType === 'CPF' ? '000.000.000-00' :
            pixKeyType === 'EMAIL' ? 'seu@email.com' :
            pixKeyType === 'PHONE' ? '(11) 99999-9999' : 'Chave aleatória'
          }
          className="input-base"
        />
        {errors.pixKey && <p className="text-xs text-neon-red mt-1">{errors.pixKey.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading || balance < 20}
        className="btn-brand w-full py-3.5"
      >
        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : 'Solicitar Saque'}
      </button>

      <p className="text-xs text-center text-text-muted">
        Processamento em até 24 horas • Sem taxas para saques acima de R$ 50
      </p>
    </form>
  )
}
