"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, Check, Plus } from "lucide-react"
import { toast } from "sonner"

export function RecurringTaskList() {
  const {
    recurringTasks,
    removeRecurringTask,
    activateRecurringTask,
    isRecurringActivatedToday,
  } = useData()

  async function handleActivate(task: (typeof recurringTasks)[number]) {
    if (isRecurringActivatedToday(task.id)) {
      toast.info("Esta tarea ya fue agregada hoy")
      return
    }
    await activateRecurringTask(task)
    toast.success(`"${task.title}" agregada a las tareas del dia`)
  }

  async function handleDelete(id: number) {
    const deleted = await removeRecurringTask(id)
    if (deleted) {
      toast.success("Tarea recurrente eliminada")
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          Mis tareas recurrentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recurringTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <RefreshCw className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No tenes tareas recurrentes configuradas
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Crea una desde el formulario de arriba
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recurringTasks.map((task) => {
              const isActivated = isRecurringActivatedToday(task.id)
              return (
                <div
                  key={task.id}
                  className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                    isActivated
                      ? "border-chart-1/30 bg-chart-1/5 opacity-70"
                      : "border-border/50 hover:bg-muted/50"
                  }`}
                  onClick={() => handleActivate(task)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleActivate(task)
                    }
                  }}
                >
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isActivated
                      ? "border-chart-1 bg-chart-1 text-primary-foreground"
                      : "border-border text-transparent group-hover:border-chart-1/50 group-hover:text-chart-1"
                  }`}>
                    {isActivated ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActivated ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(task.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Eliminar tarea recurrente</span>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
