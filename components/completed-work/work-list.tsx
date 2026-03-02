"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Wrench, ChevronDown, ChevronUp } from "lucide-react"

export function WorkList() {
  const { completedWorks, todayStr } = useData()
  const [isOpen, setIsOpen] = useState(true)

  const todayWorks = completedWorks.filter((w) => w.date === todayStr)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer pb-3 hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center justify-between text-base text-card-foreground">
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Trabajos de hoy
                {todayWorks.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {todayWorks.length}
                  </Badge>
                )}
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {todayWorks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay trabajos registrados hoy
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {todayWorks.map((work) => (
                  <div
                    key={work.id}
                    className="flex items-start gap-3 rounded-lg border border-border/50 p-3"
                  >
                    <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-card-foreground">
                          {work.title}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                          {work.area}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {work.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
