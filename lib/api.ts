import { API_URL } from "@/lib/constants"
import { getToken } from "@/lib/auth"
import type {
  RecurringTask,
  RecurringTaskFormValues,
  Claim,
  ClaimFormValues,
  CompletedWork,
  CompletedWorkFormValues,
  DailyTask,
  ReportEntry,
  ReportPeriod,
} from "@/lib/types"

// ── Fetch wrapper with auth ─────────────────────────────────
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

// ── Tareas Recurrentes ──────────────────────────────────────
export async function getRecurringTasks(userId: string): Promise<RecurringTask[]> {
  try {
    return await authFetch<RecurringTask[]>(`/recurring-tasks/${userId}`)
  } catch {
    return []
  }
}

export async function createRecurringTask(
  userId: string,
  data: RecurringTaskFormValues
): Promise<RecurringTask | null> {
  try {
    return await authFetch<RecurringTask>("/recurring-tasks", {
      method: "POST",
      body: JSON.stringify({ ...data, userId }),
    })
  } catch {
    return null
  }
}

export async function deleteRecurringTask(id: string): Promise<boolean> {
  try {
    await authFetch(`/recurring-tasks/${id}`, { method: "DELETE" })
    return true
  } catch {
    return false
  }
}

// ── Tareas del dia ──────────────────────────────────────────
export async function getDailyTasks(userId: string, date: string): Promise<DailyTask[]> {
  try {
    return await authFetch<DailyTask[]>(`/daily-tasks/${userId}?date=${date}`)
  } catch {
    return []
  }
}

export async function addDailyTask(data: Omit<DailyTask, "id">): Promise<DailyTask | null> {
  try {
    return await authFetch<DailyTask>("/daily-tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch {
    return null
  }
}

// ── Reclamos ────────────────────────────────────────────────
export async function getClaims(userId: string, date?: string): Promise<Claim[]> {
  try {
    const query = date ? `?date=${date}` : ""
    return await authFetch<Claim[]>(`/claims/${userId}${query}`)
  } catch {
    return []
  }
}

export async function createClaim(
  userId: string,
  userName: string,
  data: ClaimFormValues
): Promise<Claim | null> {
  try {
    return await authFetch<Claim>("/claims", {
      method: "POST",
      body: JSON.stringify({ ...data, userId, userName }),
    })
  } catch {
    return null
  }
}

// ── Trabajos Realizados ─────────────────────────────────────
export async function getCompletedWorks(userId: string, date?: string): Promise<CompletedWork[]> {
  try {
    const query = date ? `?date=${date}` : ""
    return await authFetch<CompletedWork[]>(`/completed-works/${userId}${query}`)
  } catch {
    return []
  }
}

export async function createCompletedWork(
  userId: string,
  userName: string,
  data: CompletedWorkFormValues
): Promise<CompletedWork | null> {
  try {
    return await authFetch<CompletedWork>("/completed-works", {
      method: "POST",
      body: JSON.stringify({ ...data, userId, userName }),
    })
  } catch {
    return null
  }
}

// ── Informes (admin) ────────────────────────────────────────
export async function getReport(period: ReportPeriod): Promise<ReportEntry[]> {
  try {
    return await authFetch<ReportEntry[]>(`/reports?period=${period}`)
  } catch {
    return []
  }
}
