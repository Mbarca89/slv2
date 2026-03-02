"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
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

interface DataContextValue {
  // Tareas recurrentes
  recurringTasks: RecurringTask[]
  addRecurringTask: (data: RecurringTaskFormValues) => void
  removeRecurringTask: (id: string) => void

  // Tareas del dia
  dailyTasks: DailyTask[]
  activateRecurringTask: (task: RecurringTask) => void
  isRecurringActivatedToday: (taskId: string) => boolean

  // Reclamos
  claims: Claim[]
  addClaim: (data: ClaimFormValues) => void

  // Trabajos realizados
  completedWorks: CompletedWork[]
  addCompletedWork: (data: CompletedWorkFormValues) => void

  // Helpers
  todayStr: string
}

const DataContext = createContext<DataContextValue | null>(null)

let idCounter = 0
function genId() {
  idCounter += 1
  return `local-${Date.now()}-${idCounter}`
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const todayStr = format(new Date(), "yyyy-MM-dd")

  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [completedWorks, setCompletedWorks] = useState<CompletedWork[]>([])

  // ── Tareas recurrentes ──────────────────────────────────
  const addRecurringTask = useCallback(
    (data: RecurringTaskFormValues) => {
      if (!user) return
      const task: RecurringTask = {
        id: genId(),
        userId: user.id,
        title: data.title,
        description: data.description,
      }
      setRecurringTasks((prev) => [...prev, task])
    },
    [user]
  )

  const removeRecurringTask = useCallback((id: string) => {
    setRecurringTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ── Activar recurrente como tarea del dia ───────────────
  const activateRecurringTask = useCallback(
    (task: RecurringTask) => {
      if (!user) return
      const daily: DailyTask = {
        id: genId(),
        userId: user.id,
        userName: `${user.name} ${user.surname}`,
        date: todayStr,
        type: "recurrente",
        title: task.title,
        description: task.description,
      }
      setDailyTasks((prev) => [...prev, daily])
    },
    [user, todayStr]
  )

  const isRecurringActivatedToday = useCallback(
    (taskId: string) => {
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
    (data: ClaimFormValues) => {
      if (!user) return
      const claim: Claim = {
        id: genId(),
        userId: user.id,
        userName: `${user.name} ${user.surname}`,
        date: todayStr,
        ...data,
      }
      setClaims((prev) => [...prev, claim])

      // Tambien agregar como tarea del dia
      const daily: DailyTask = {
        id: genId(),
        userId: user.id,
        userName: `${user.name} ${user.surname}`,
        date: todayStr,
        type: "reclamo",
        title: data.title,
        description: data.description,
        area: data.area,
      }
      setDailyTasks((prev) => [...prev, daily])
    },
    [user, todayStr]
  )

  // ── Trabajos realizados ─────────────────────────────────
  const addCompletedWork = useCallback(
    (data: CompletedWorkFormValues) => {
      if (!user) return
      const work: CompletedWork = {
        id: genId(),
        userId: user.id,
        userName: `${user.name} ${user.surname}`,
        date: todayStr,
        ...data,
      }
      setCompletedWorks((prev) => [...prev, work])

      // Tambien agregar como tarea del dia
      const daily: DailyTask = {
        id: genId(),
        userId: user.id,
        userName: `${user.name} ${user.surname}`,
        date: todayStr,
        type: "trabajo",
        title: data.title,
        description: data.description,
        area: data.area,
      }
      setDailyTasks((prev) => [...prev, daily])
    },
    [user, todayStr]
  )

  return (
    <DataContext.Provider
      value={{
        recurringTasks,
        addRecurringTask,
        removeRecurringTask,
        dailyTasks,
        activateRecurringTask,
        isRecurringActivatedToday,
        claims,
        addClaim,
        completedWorks,
        addCompletedWork,
        todayStr,
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
