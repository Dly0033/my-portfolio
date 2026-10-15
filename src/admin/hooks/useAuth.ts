import { useCallback, useState } from 'react'
import { api, getSession } from '@/api'
import type { LoginCredentials } from '@/api'

export function useAuth() {
  const [session, setSession] = useState(() => getSession())

  const login = useCallback(async (credentials: LoginCredentials) => {
    const next = await api.login(credentials)
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setSession(null)
  }, [])

  return { session, isAuthenticated: Boolean(session), login, logout }
}
