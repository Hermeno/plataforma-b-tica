'use client'

import { useState } from 'react'
import { Copy, CheckCheck, Loader2, QrCode, RefreshCw, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { formatBRL } from '@/lib/utils'
import Image from 'next/image'

const QUICK_VALUES = [10, 20, 50, 100, 200, 500]

interface PixData {
  transactionId: string
  txid: string
  pixCopiaECola: string
  qrCode: string
  expiresIn: number
  amount: number
}

export default function PixDepositForm() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const handleDeposit = async () => {
    const value = parseFloat(amount.replace(',', '.'))
    if (!value || value < 10) return toast.error('Valor mínimo: R$ 10,00')
    if (value > 1000) return toast.error('Valor máximo: R$ 1.000,00')

    setLoading(true)
    try {
      const { data } = await api.post('/wallet/deposit/pix', { amount: value })
      setPixData(data)
      setTimeLeft(data.expiresIn)

      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(timer); return 0 }
          return t - 1
        })
      }, 1000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao gerar PIX')
    } finally {
      setLoading(false)
    }
  }

  const copyPix = async () => {
    if (!pixData) return
    await navigator.clipboard.writeText(pixData.pixCopiaECola)
    setCopied(true)
    toast.success('Código PIX copiado!')
    setTimeout(() => setCopied(false), 3000)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (pixData) {
    return (
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="card p-4 bg-neon-green/5 border-neon-green/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">PIX gerado com sucesso!</p>
            <p className="text-xs text-text-muted mt-0.5">Valor: <span className="text-text-primary font-bold">{formatBRL(pixData.amount)}</span></p>
          </div>
          {timeLeft > 0 ? (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <span className="text-xs text-neon-red font-semibold">Expirado</span>
          )}
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="card p-4 inline-block">
            {pixData.qrCode ? (
              <Image src={pixData.qrCode} alt="QR Code PIX" width={200} height={200} className="rounded" />
            ) : (
              <div className="w-48 h-48 bg-surface-elevated rounded flex items-center justify-center">
                <QrCode className="w-16 h-16 text-text-muted" />
              </div>
            )}
          </div>
        </div>

        {/* PIX copy-paste */}
        <div>
          <p className="text-xs text-text-muted mb-2">Código PIX Copia e Cola</p>
          <div className="flex gap-2">
            <div className="flex-1 card px-3 py-2.5 text-xs text-text-secondary font-mono truncate bg-surface-elevated">
              {pixData.pixCopiaECola.slice(0, 40)}...
            </div>
            <button onClick={copyPix} className="btn-brand px-4 py-2.5 text-xs flex-shrink-0">
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="card p-4 space-y-2">
          <p className="text-sm font-semibold text-text-primary">Como pagar:</p>
          {['Abra o app do seu banco', 'Acesse área PIX → Pagar', 'Escaneie o QR Code ou cole o código', 'Confirme o pagamento de ' + formatBRL(pixData.amount), 'Seu saldo será creditado automaticamente'].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-text-secondary">{step}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPixData(null)}
          className="btn-ghost w-full gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Gerar novo PIX
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick values */}
      <div>
        <p className="text-sm font-medium text-text-secondary mb-3">Valores rápidos</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_VALUES.map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v.toString())}
              className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                amount === v.toString()
                  ? 'bg-brand text-black border-brand shadow-brand'
                  : 'bg-surface-card border-surface-border text-text-secondary hover:border-brand/40'
              }`}
            >
              {formatBRL(v)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Ou digite um valor
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">R$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            min={10}
            max={1000}
            className="input-base pl-10 text-lg font-semibold"
          />
        </div>
        <p className="text-xs text-text-muted mt-1">Mín: R$ 10 • Máx: R$ 1.000 por transação</p>
      </div>

      {/* Bonus info */}
      {parseFloat(amount) >= 20 && (
        <div className="card p-3 bg-brand/5 border-brand/20 animate-slide-up">
          <p className="text-sm text-brand font-semibold">🎉 Bônus disponível!</p>
          <p className="text-xs text-text-secondary mt-0.5">
            Deposite agora e ganhe <strong className="text-brand">100% até R$ 500</strong> de bônus de boas-vindas
          </p>
        </div>
      )}

      <button
        onClick={handleDeposit}
        disabled={loading || !amount || parseFloat(amount) < 10 || parseFloat(amount) > 1000}
        className="btn-brand w-full py-3.5 text-base"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Gerando PIX...</>
        ) : (
          <>Depositar {amount ? formatBRL(parseFloat(amount) || 0) : ''} via PIX</>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 pt-2">
        {['Instantâneo', 'Sem taxas', 'Seguro'].map((item) => (
          <div key={item} className="flex items-center gap-1.5 text-xs text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
