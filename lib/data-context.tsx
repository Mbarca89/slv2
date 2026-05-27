"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type {
  RecurringTask,
  DailyTask,
  Claim,
  CompletedWork,
  RecurringTaskFormValues,
  ClaimFormValues,
  CompletedWorkFormValues,
} from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import * as api from "@/lib/api"
import { toast } from "sonner"

interface DataContextValue {
  // Tareas recurrentes
  recurringTasks: RecurringTask[]
  addRecurringTask: (data: RecurringTaskFormValues) => Promise<void>
  removeRecurringTask: (id: number) => Promise<boolean>
  loadingRecurring: boolean

  // Tareas del dia
  dailyTasks: DailyTask[]
  activateRecurringTask: (task: RecurringTask) => Promise<void>
  isRecurringActivatedToday: (taskId: number) => boolean
  loadingDaily: boolean

  // Reclamos
  claims: Claim[]
  addClaim: (data: ClaimFormValues) => Promise<void>
  updateClaim: (id: number, data: ClaimFormValues) => Promise<boolean>
  loadingClaims: boolean

  // Trabajos realizados
  completedWorks: CompletedWork[]
  addCompletedWork: (data: CompletedWorkFormValues) => Promise<void>
  updateCompletedWork: (id: number, data: CompletedWorkFormValues) => Promise<boolean>
  loadingWorks: boolean

  // Helpers
  todayStr: string
  refreshAll: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const todayStr = format(new Date(), "yyyy-MM-dd")

  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [completedWorks, setCompletedWorks] = useState<CompletedWork[]>([])

  const [loadingRecurring, setLoadingRecurring] = useState(false)
  const [loadingDaily, setLoadingDaily] = useState(false)
  const [loadingClaims, setLoadingClaims] = useState(false)
  const [loadingWorks, setLoadingWorks] = useState(false)

  // ── Fetch data on mount ─────────────────────────────────
  const fetchRecurring = useCallback(async () => {
    if (!user) return
    setLoadingRecurring(true)
    const data = await api.getRecurringTasks(user.id)
    setRecurringTasks(data)
    setLoadingRecurring(false)
  }, [user])

  const fetchDaily = useCallback(async () => {
    if (!user) return
    setLoadingDaily(true)
    const data = await api.getDailyTasks(user.id, todayStr)
    setDailyTasks(data)
    setLoadingDaily(false)
  }, [user, todayStr])

  const fetchClaims = useCallback(async () => {
    if (!user) return
    setLoadingClaims(true)
    const data = await api.getClaims(user.id, todayStr)
    setClaims(data)
    setLoadingClaims(false)
  }, [user, todayStr])

  const fetchWorks = useCallback(async () => {
    if (!user) return
    setLoadingWorks(true)
    const data = await api.getCompletedWorks(user.id, todayStr)
    setCompletedWorks(data)
    setLoadingWorks(false)
  }, [user, todayStr])

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchRecurring(), fetchDaily(), fetchClaims(), fetchWorks()])
  }, [fetchRecurring, fetchDaily, fetchClaims, fetchWorks])

  useEffect(() => {
    if (user) {
      refreshAll()
    }
  }, [user, refreshAll])

  // ── Tareas recurrentes ──────────────────────────────────
  const addRecurringTask = useCallback(
    async (data: RecurringTaskFormValues) => {
      if (!user) return
      const created = await api.createRecurringTask(user.id, data)
      if (created) {
        setRecurringTasks((prev) => [...prev, created])
      } else {
        toast.error("Error al guardar la tarea recurrente")
      }
    },
    [user]
  )

  const removeRecurringTask = useCallback(async (id: number) => {
    const success = await api.deleteRecurringTask(id)
    if (success) {
      await fetchRecurring()
      return true
    } else {
      toast.error("Error al eliminar la tarea recurrente")
      return false
    }
  }, [fetchRecurring])

  // ── Activar recurrente como tarea del dia ───────────────
  const activateRecurringTask = useCallback(
    async (task: RecurringTask) => {
      if (!user) return
      const dailyData = {
        userId: user.id,
        userName: `${user.name} ${user.surname}`,
        date: todayStr,
        type: "recurrente" as const,
        title: task.title,
        description: task.description,
      }
      const created = await api.addDailyTask(dailyData)
      if (created) {
        setDailyTasks((prev) => [...prev, created])
      } else {
        toast.error("Error al activar la tarea")
      }
    },
    [user, todayStr]
  )

  const isRecurringActivatedToday = useCallback(
    (taskId: number) => {
      const task = recurringTasks.find((t) => t.id === taskId)
      if (!task) return false
      return dailyTasks.some(
        (d) =>
          d.type === "recurrente" &&
          d.title === task.title &&
          d.date === todayStr
      )
    },
    [dailyTasks, recurringTasks, todayStr]
  )

  // ── Reclamos ────────────────────────────────────────────
  const addClaim = useCallback(
    async (data: ClaimFormValues) => {
      if (!user) return
      const userName = `${user.name} ${user.surname}`
      const created = await api.createClaim(user.id, userName, data)
      if (created) {
        setClaims((prev) => [...prev, created])
        await fetchDaily()
      } else {
        toast.error("Error al registrar el reclamo")
      }
    },
    [user, fetchDaily]
  )

  const updateClaim = useCallback(
    async (id: number, data: ClaimFormValues) => {
      const updated = await api.updateClaim(id, data)
      if (!updated) {
        toast.error("Error al editar el reclamo")
        return false
      }

      setClaims((prev) => prev.map((claim) => (claim.id === id ? updated : claim)))
      await fetchDaily()
      return true
    },
    [fetchDaily]
  )

  // ── Trabajos realizados ─────────────────────────────────
  const addCompletedWork = useCallback(
    async (data: CompletedWorkFormValues) => {
      if (!user) return
      const userName = `${user.name} ${user.surname}`
      const created = await api.createCompletedWork(user.id, userName, data)
      if (created) {
        setCompletedWorks((prev) => [...prev, created])
        await fetchDaily()
      } else {
        toast.error("Error al registrar el trabajo")
      }
    },
    [user, fetchDaily]
  )

  const updateCompletedWork = useCallback(
    async (id: number, data: CompletedWorkFormValues) => {
      const updated = await api.updateCompletedWork(id, data)
      if (!updated) {
        toast.error("Error al editar el trabajo")
        return false
      }

      setCompletedWorks((prev) => prev.map((work) => (work.id === id ? updated : work)))
      await fetchDaily()
      return true
    },
    [fetchDaily]
  )

  return (
    <DataContext.Provider
      value={{
        recurringTasks,
        addRecurringTask,
        removeRecurringTask,
        loadingRecurring,
        dailyTasks,
        activateRecurringTask,
        isRecurringActivatedToday,
        loadingDaily,
        claims,
        addClaim,
        updateClaim,
        loadingClaims,
        completedWorks,
        addCompletedWork,
        updateCompletedWork,
        loadingWorks,
        todayStr,
        refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within <DataProvider>")
  return ctx
}
