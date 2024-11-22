import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(
  persist((set, get) => ({
    user: null,
    clearUser: () => set((state) => ({ user: null })),
    saveUser: user => set(state => ({ user }))
  }), { name: 'app-store' })
)
