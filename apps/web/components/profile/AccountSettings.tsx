'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'

export default function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return toast.error('Senhas não coincidem')
    if (newPassword.length < 8) return toast.error('Mínimo 8 caracteres')
    setLoading(true)
    try {
      await api.patch('/users/password', { currentPassword, newPassword })
      setDone(true)
      toast.success('Senha alterada com sucesso!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Senha atual incorreta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Alterar Senha</h3>
        {done ? (
          <div className="flex items-center gap-3 text-neon-green">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">Senha alterada com sucesso!</p>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Senha atual', value: currentPassword, set: setCurrentPassword },
              { label: 'Nova senha', value: newPassword, set: setNewPassword },
              { label: 'Confirmar nova senha', value: confirmPassword, set: setConfirmPassword },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="input-base pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-brand w-full py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Alterando...</> : 'Alterar Senha'}
            </button>
          </form>
        )}
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Autenticação em 2 fatores</h3>
        <p className="text-xs text-text-muted mb-4">Adiciona uma camada extra de segurança à sua conta</p>
        <button className="btn-ghost w-full py-2.5 text-sm">Ativar 2FA com Google Authenticator</button>
      </div>
    </div>
  )
}
