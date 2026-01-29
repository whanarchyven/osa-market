import { useEffect } from 'react'
import { useAuthStore } from '@/shared/store'
import { clearAuthClientStorage, getAuthEmailFromCookie } from '@/shared/lib/auth'

export const useAuthSync = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const email = getAuthEmailFromCookie()
    if (!email) {
      logout()
      clearAuthClientStorage()
    }
  }, [isAuthenticated, logout])
}
