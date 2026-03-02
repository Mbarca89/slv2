import type { User } from "@/lib/types"

const TOKEN_KEY = "token"
const USER_KEYS = ["id", "name", "surname", "userName", "role", "area"] as const

// ── Token helpers ───────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

// ── User helpers ────────────────────────────────────────────
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_KEY)
  const id = localStorage.getItem("id")
  const name = localStorage.getItem("name")
  if (!token || !id || !name) return null

  return {
    id: id,
    name: name,
    surname: localStorage.getItem("surname") ?? "",
    userName: localStorage.getItem("userName") ?? "",
    role: (localStorage.getItem("role") as "ADMIN" | "USER") ?? "USER",
    area: localStorage.getItem("area") ?? "",
    token,
  }
}

export function storeUser(user: User, remember: boolean): void {
  setToken(user.token)
  if (remember) {
    for (const key of USER_KEYS) {
      localStorage.setItem(key, user[key])
    }
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  for (const key of USER_KEYS) {
    localStorage.removeItem(key)
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN"
}

// ── Mock users (eliminar cuando conectes el backend) ────────
export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin",
    surname: "Sistema",
    userName: "admin",
    password: "admin123",
    role: "ADMIN",
    area: "Sistemas",
    token: "mock-jwt-token-admin-001",
  },
  {
    id: "2",
    name: "Juan",
    surname: "Perez",
    userName: "jperez",
    password: "user123",
    role: "USER",
    area: "Sistemas",
    token: "mock-jwt-token-user-002",
  },
]
