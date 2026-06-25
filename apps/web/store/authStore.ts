import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string | null
  username: string
  cpf: string | null
  phone: string
  fullName: string
  role: string
  kycStatus: string
  status: string
  emailVerified: boolean
  phoneVerified: boolean
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: any) => void
  setToken: (accessToken: string, refreshToken?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (accessToken, refreshToken) => set((s) => ({ accessToken, refreshToken: refreshToken ?? s.refreshToken })),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'leaozinho-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
