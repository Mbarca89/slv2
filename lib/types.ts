// ── User & Auth ──────────────────────────────────────────────
export interface User {
  id: number
  name: string
  surname: string
  userName: string
  role: "ADMIN" | "USER"
  area: string
  token: string
}

export interface LoginCredentials {
  userName: string
  password: string
  remember: boolean
}

// ── Tareas Recurrentes (templates del usuario) ──────────────
export interface RecurringTask {
  id: number
  userId: number
  title: string
  description: string
}

// ── Tarea del dia (instancia activada) ──────────────────────
export interface DailyTask {
  id: number
  userId: number
  userName: string
  date: string
  type: "recurrente" | "reclamo" | "trabajo"
  title: string
  description: string
  area?: string
}

// ── Reclamo / Ticket ────────────────────────────────────────
export interface Claim {
  id: number
  userId: number
  userName: string
  date: string
  title: string
  area: string
  claimant: string
  problemType: string
  description: string
  solution: string
  images: string[]
}

// ── Trabajo realizado (sin reclamo) ─────────────────────────
export interface CompletedWork {
  id: number
  userId: number
  userName: string
  date: string
  title: string
  area: string
  description: string
}

// ── Forms ───────────────────────────────────────────────────
export interface RecurringTaskFormValues {
  title: string
  description: string
}

export interface ClaimFormValues {
  title: string
  area: string
  claimant: string
  problemType: string
  description: string
  solution: string
  images: string[]
}

export interface CompletedWorkFormValues {
  title: string
  area: string
  description: string
}

// ── Reports ─────────────────────────────────────────────────
export type ReportPeriod = "today" | "week" | "month"

export interface ReportEntry {
  id: number
  date: string
  userName: string
  type: "recurrente" | "reclamo" | "trabajo"
  title: string
  area: string
  description: string
}
