'use client'

import { useState, useRef } from 'react'
import { ShieldCheck, Upload, CheckCircle2, Clock, XCircle, FileText, Camera, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const DOC_TYPES = [
  { value: 'RG', label: 'RG (Registro Geral)' },
  { value: 'CNH', label: 'CNH (Carteira de Habilitação)' },
  { value: 'PASSAPORTE', label: 'Passaporte' },
]

const STATUS_CONFIG = {
  NOT_STARTED: { icon: FileText, color: 'text-text-muted', bg: 'bg-surface-elevated', label: 'Não iniciado' },
  PENDING: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Em análise (1–2 dias úteis)' },
  APPROVED: { icon: CheckCircle2, color: 'text-neon-green', bg: 'bg-neon-green/10', label: 'Verificado ✓' },
  REJECTED: { icon: XCircle, color: 'text-neon-red', bg: 'bg-neon-red/10', label: 'Rejeitado — envie novamente' },
}

export default function KycVerification() {
  const { user } = useAuthStore()
  const [docType, setDocType] = useState('RG')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  const kycStatus = (user?.kycStatus || 'NOT_STARTED') as keyof typeof STATUS_CONFIG
  const config = STATUS_CONFIG[kycStatus]
  const Icon = config.icon

  const handleSubmit = async () => {
    if (!frontFile || !selfieFile) return toast.error('Envie a frente do documento e a selfie')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('docType', docType)
      form.append('front', frontFile)
      if (backFile) form.append('back', backFile)
      form.append('selfie', selfieFile)
      await api.post('/kyc/submit', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Documentos enviados! Análise em até 2 dias úteis.')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao enviar documentos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className={cn('card p-4 flex items-center gap-4', config.bg)}>
        <Icon className={cn('w-8 h-8', config.color)} />
        <div>
          <p className="font-semibold text-text-primary">Verificação de Identidade (KYC)</p>
          <p className={cn('text-sm', config.color)}>{config.label}</p>
        </div>
      </div>

      {kycStatus === 'APPROVED' && (
        <div className="card p-5 text-center">
          <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-3" />
          <p className="font-bold text-text-primary">Sua conta está verificada!</p>
          <p className="text-text-muted text-sm mt-1">Você pode sacar sem restrições.</p>
        </div>
      )}

      {(kycStatus === 'NOT_STARTED' || kycStatus === 'REJECTED') && (
        <div className="space-y-5">
          <div className="card p-4 space-y-2">
            <p className="text-sm font-semibold text-text-primary">Por que verificar?</p>
            {['Habilitar saques sem restrições', 'Proteger sua conta', 'Conformidade com regulamentação BR'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-green flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Doc type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Tipo de documento</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)} className="input-base">
              {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          {/* Uploads */}
          {[
            { label: 'Frente do documento', ref: frontRef, file: frontFile, setFile: setFrontFile, icon: FileText, required: true },
            { label: 'Verso do documento', ref: backRef, file: backFile, setFile: setBackFile, icon: FileText, required: false },
            { label: 'Selfie segurando o documento', ref: selfieRef, file: selfieFile, setFile: setSelfieFile, icon: Camera, required: true },
          ].map(({ label, ref, file, setFile, icon: UploadIcon, required }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {label} {required && <span className="text-neon-red">*</span>}
              </label>
              <div
                onClick={() => ref.current?.click()}
                className={cn(
                  'card p-4 flex items-center gap-3 cursor-pointer transition-all',
                  file ? 'border-neon-green/40 bg-neon-green/5' : 'hover:border-brand/40'
                )}
              >
                <UploadIcon className={cn('w-5 h-5 flex-shrink-0', file ? 'text-neon-green' : 'text-text-muted')} />
                <span className={cn('text-sm', file ? 'text-neon-green' : 'text-text-muted')}>
                  {file ? file.name : `Clique para enviar (JPG, PNG, PDF)`}
                </span>
                {file && <CheckCircle2 className="w-4 h-4 text-neon-green ml-auto" />}
                {!file && <Upload className="w-4 h-4 text-text-muted ml-auto" />}
              </div>
              <input
                ref={ref}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading || !frontFile || !selfieFile}
            className="btn-brand w-full py-3"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar Documentos'}
          </button>
        </div>
      )}

      {kycStatus === 'PENDING' && (
        <div className="card p-6 text-center space-y-3">
          <Clock className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="font-semibold text-text-primary">Documentos em análise</p>
          <p className="text-text-muted text-sm">Nossa equipe está verificando seus documentos. Prazo: 1–2 dias úteis.</p>
        </div>
      )}
    </div>
  )
}
