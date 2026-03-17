"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, AlertTriangle, Wrench, ClipboardList } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const TYPE_CONFIG = {
  recurrente: {
    label: "Recurrente",
    className: "bg-chart-1/15 text-chart-1 border-chart-1/30",
    icon: RefreshCw,
  },
  reclamo: {
    label: "Reclamo",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: AlertTriangle,
  },
  trabajo: {
    label: "Trabajo",
    className: "bg-chart-2/15 text-chart-2 border-chart-2/30",
    icon: Wrench,
  },
} as const

export function DashboardSummary() {
  const { dailyTasks, claims, completedWorks, todayStr } = useData()

  const isToday = (value: string) => value === todayStr || value.startsWith(`${todayStr}T`)

  const recurrentTasks = dailyTasks.filter((t) => t.type === "recurrente" && isToday(t.date))
  const claimTasks = claims
    .filter((claim) => isToday(claim.date))
    .map((claim) => ({
      id: claim.id,
      type: "reclamo" as const,
      title: claim.title,
      description: claim.description,
      area: claim.area,
    }))
  const workTasks = completedWorks
    .filter((work) => isToday(work.date))
    .map((work) => ({
      id: work.id,
      type: "trabajo" as const,
      title: work.title,
      description: work.description,
      area: work.area,
    }))

  const todayTasks = [...recurrentTasks, ...claimTasks, ...workTasks]

  const recurrentCount = recurrentTasks.length
  const claimCount = claimTasks.length
  const workCount = workTasks.length

  const formattedDate = format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })

  const stats = [
    {
      title: "Recurrentes",
      value: recurrentCount,
      icon: RefreshCw,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      title: "Reclamos",
      value: claimCount,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Trabajos",
      value: workCount,
      icon: Wrench,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          Resumen del dia
        </h1>
        <p className="mt-1 text-sm text-muted-foreground capitalize">
          {formattedDate}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title} hoy</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task list */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            Tareas del dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                No hay tareas registradas hoy
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Carga tareas recurrentes, reclamos o trabajos realizados
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {todayTasks.map((task) => {
                const config = TYPE_CONFIG[task.type]
                return (
                  <div
                    key={`${task.type}-${task.id}`}
                    className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                  >
                    <config.icon className={`mt-0.5 h-4 w-4 shrink-0 ${
                      task.type === "recurrente" ? "text-chart-1" :
                      task.type === "reclamo" ? "text-destructive" :
                      "text-chart-2"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {task.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] ${config.className}`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    {task.area && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {task.area}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
