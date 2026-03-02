"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, ChevronDown, ChevronUp, Eye } from "lucide-react"

export function ClaimList() {
  const { claims, todayStr } = useData()
  const [isOpen, setIsOpen] = useState(true)

  const todayClaims = claims.filter((c) => c.date === todayStr)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer pb-3 hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center justify-between text-base text-card-foreground">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                Reclamos de hoy
                {todayClaims.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {todayClaims.length}
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
            {todayClaims.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay reclamos registrados hoy
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {todayClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex items-start gap-3 rounded-lg border border-border/50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-card-foreground">
                          {claim.title}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                          {claim.problemType}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {claim.area} - {claim.claimant}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">Ver detalle</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">{claim.title}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Area</p>
                              <p className="text-foreground">{claim.area}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Reclama</p>
                              <p className="text-foreground">{claim.claimant}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                              <p className="text-foreground">{claim.problemType}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Descripcion</p>
                            <p className="text-foreground whitespace-pre-wrap">{claim.description}</p>
                          </div>
                          {claim.solution && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Solucion</p>
                              <p className="text-foreground whitespace-pre-wrap">{claim.solution}</p>
                            </div>
                          )}
                          {claim.images.length > 0 && (
                            <div>
                              <p className="mb-2 text-xs font-medium text-muted-foreground">
                                Capturas ({claim.images.length})
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {claim.images.map((src, i) => (
                                  <img
                                    key={i}
                                    src={src}
                                    alt={`Captura ${i + 1}`}
                                    className="rounded-lg border border-border object-cover aspect-video w-full"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
