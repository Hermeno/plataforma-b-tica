import { create } from 'zustand'

interface WalletStore {
  balance: number
  bonusBalance: number
  isLoading: boolean
  setBalance: (balance: number) => void
  setBonusBalance: (bonus: number) => void
  incrementBalance: (amount: number) => void
  decrementBalance: (amount: number) => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: 0,
  bonusBalance: 0,
  isLoading: false,
  setBalance: (balance) => set({ balance }),
  setBonusBalance: (bonusBalance) => set({ bonusBalance }),
  incrementBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  decrementBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
}))
