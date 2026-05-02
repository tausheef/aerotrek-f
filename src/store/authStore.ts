import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { TOKEN_KEY } from '../api/axios'

interface AuthState {
  user:       User | null
  token:      string | null
  isHydrated: boolean

  setAuth:     (user: User, token: string) => void
  setUser:     (user: User) => void
  clearAuth:   () => void
  setHydrated: (val: boolean) => void

  isAuthenticated: () => boolean
  isAdmin:         () => boolean
  isKycVerified:   () => boolean
  isCompany:       () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:       null,
      token:      null,
      isHydrated: false,

      setAuth: (user, token) => {
        localStorage.setItem(TOKEN_KEY, token)
        set({ user, token })
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY)
        set({ user: null, token: null })
      },

      setHydrated: (val) => set({ isHydrated: val }),

      // is_admin boolean from User model
      isAuthenticated: () => !!get().token && !!get().user,
      isAdmin:         () => get().user?.is_admin === true,
      isKycVerified:   () => get().user?.kyc_status === 'verified',
      isCompany:       () => get().user?.account_type === 'company',
    }),
    {
      name: 'aerotrek-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
)