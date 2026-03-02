"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { User, LoginCredentials } from "@/lib/types"
import {
  getStoredUser,
  storeUser,
  clearAuth,
  MOCK_USERS,
} from "@/lib/auth"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Recuperar sesion al montar
  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
    }
    setLoading(false)
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      try {
        // ── MOCK: reemplazar por fetch al backend ──────────
        // const res = await fetch(`${API_URL}/auth/login`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     userName: credentials.userName.toLowerCase(),
        //     password: hashedPassword, // hash con CryptoJS
        //     remember: credentials.remember,
        //   }),
        // })
        // const data = await res.json()

        const found = MOCK_USERS.find(
          (u) =>
            u.userName.toLowerCase() === credentials.userName.toLowerCase() &&
            u.password === credentials.password
        )

        if (!found) {
          return { success: false, error: "Usuario o contrasena incorrectos" }
        }

        const loggedUser: User = {
          id: found.id,
          name: found.name,
          surname: found.surname,
          userName: found.userName,
          role: found.role,
          area: found.area,
          token: found.token,
        }

        storeUser(loggedUser, credentials.remember)
        setUser(loggedUser)
        return { success: true }
      } catch {
        return { success: false, error: "Error de conexion con el servidor" }
      }
    },
    []
  )

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
