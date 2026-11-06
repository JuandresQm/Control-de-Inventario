import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api } from './services/api'

export interface SessionUser { usuarioId: number; nombre: string; rol: string | null }
interface AuthContextValue { user: SessionUser | null; login: (nombre: string, clave: string) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const stored = localStorage.getItem('inventory_user')
    return stored ? JSON.parse(stored) as SessionUser : null
  })

  const value = useMemo<AuthContextValue>(() => ({
    user,
    async login(nombre, clave) {
      const { data } = await api.post<{ accessToken: string; usuario: SessionUser }>('/auth/login', { nombre, clave })
      localStorage.setItem('inventory_token', data.accessToken)
      localStorage.setItem('inventory_user', JSON.stringify(data.usuario))
      setUser(data.usuario)
    },
    logout() {
      localStorage.removeItem('inventory_token')
      localStorage.removeItem('inventory_user')
      setUser(null)
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return user?.rol === 'administrador' ? children : <Navigate to="/productos" replace />
}
