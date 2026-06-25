import { create } from 'zustand'

interface WalletStore {
  balance: number
  bonusBalance: number
  rolloverRequired: number
  rolloverCompleted: number
  isLoading: boolean
  setBalance: (balance: number) => void
  setBonusBalance: (bonus: number) => void
  setRollover: (required: number, completed: number) => void
  incrementBalance: (amount: number) => void
  decrementBalance: (amount: number) => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: 0,
  bonusBalance: 0,
  rolloverRequired: 0,
  rolloverCompleted: 0,
  isLoading: false,
  setBalance: (balance) => set({ balance }),
  setBonusBalance: (bonusBalance) => set({ bonusBalance }),
  setRollover: (rolloverRequired, rolloverCompleted) => set({ rolloverRequired, rolloverCompleted }),
  incrementBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  decrementBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
}))
