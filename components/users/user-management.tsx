"use client"

import { useState } from "react"
import { createUser, deleteUser, updateUser } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function buildPayload(values: { name: string; surname: string; userName: string; password: string; role: "ADMIN" | "USER" }) {
  return { ...values, area: "sistemas" }
}

export function UserManagement() {
  const { toast } = useToast()
  const [createForm, setCreateForm] = useState({ name: "", surname: "", userName: "", password: "", role: "USER" as "ADMIN" | "USER" })
  const [editForm, setEditForm] = useState({ id: "", name: "", surname: "", userName: "", password: "", role: "USER" as "ADMIN" | "USER" })
  const [deleteId, setDeleteId] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const showResult = (message: string, ok: boolean) => toast({ title: ok ? "Operacion exitosa" : "Operacion fallida", description: message, variant: ok ? "default" : "destructive" })

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading("create")
    const message = await createUser(buildPayload(createForm))
    showResult(message, !message.toLowerCase().includes("error")); setLoading(null)
  }

  const onEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.id) return showResult("Debes indicar el ID del usuario a editar", false)
    setLoading("edit")
    const message = await updateUser(Number(editForm.id), buildPayload(editForm))
    showResult(message, !message.toLowerCase().includes("error")); setLoading(null)
  }

  const onDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deleteId) return showResult("Debes indicar el ID del usuario a eliminar", false)
    setLoading("delete")
    const message = await deleteUser(Number(deleteId))
    showResult(message, !message.toLowerCase().includes("error")); setLoading(null)
  }

  return (
    <Card>
      <CardHeader><CardTitle>Control de usuarios</CardTitle><CardDescription>Creacion, edicion y eliminacion (solo ADMIN)</CardDescription></CardHeader>
      <CardContent>
        <Tabs defaultValue="crear" className="space-y-4">
          <TabsList><TabsTrigger value="crear">Crear</TabsTrigger><TabsTrigger value="editar">Editar</TabsTrigger><TabsTrigger value="eliminar">Eliminar</TabsTrigger></TabsList>
          <TabsContent value="crear"><form onSubmit={onCreate} className="grid gap-3">
            <Field label="Nombre" value={createForm.name} onChange={(v) => setCreateForm((p) => ({ ...p, name: v }))} />
            <Field label="Apellido" value={createForm.surname} onChange={(v) => setCreateForm((p) => ({ ...p, surname: v }))} />
            <Field label="Usuario" value={createForm.userName} onChange={(v) => setCreateForm((p) => ({ ...p, userName: v }))} />
            <Field label="Contrasena" type="password" value={createForm.password} onChange={(v) => setCreateForm((p) => ({ ...p, password: v }))} />
            <RoleSelect value={createForm.role} onChange={(role) => setCreateForm((p) => ({ ...p, role }))} />
            <Button disabled={loading === "create"} type="submit">Crear usuario</Button></form></TabsContent>
          <TabsContent value="editar"><form onSubmit={onEdit} className="grid gap-3">
            <Field label="ID Usuario" value={editForm.id} onChange={(v) => setEditForm((p) => ({ ...p, id: v }))} />
            <Field label="Nombre" value={editForm.name} onChange={(v) => setEditForm((p) => ({ ...p, name: v }))} />
            <Field label="Apellido" value={editForm.surname} onChange={(v) => setEditForm((p) => ({ ...p, surname: v }))} />
            <Field label="Usuario" value={editForm.userName} onChange={(v) => setEditForm((p) => ({ ...p, userName: v }))} />
            <Field label="Contrasena" type="password" value={editForm.password} onChange={(v) => setEditForm((p) => ({ ...p, password: v }))} />
            <RoleSelect value={editForm.role} onChange={(role) => setEditForm((p) => ({ ...p, role }))} />
            <Button disabled={loading === "edit"} type="submit">Guardar cambios</Button></form></TabsContent>
          <TabsContent value="eliminar"><form onSubmit={onDelete} className="grid gap-3 max-w-sm">
            <Field label="ID Usuario" value={deleteId} onChange={setDeleteId} />
            <Button variant="destructive" disabled={loading === "delete"} type="submit">Eliminar usuario</Button></form></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <div className="grid gap-2"><Label>{label}</Label><Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required /></div>
}

function RoleSelect({ value, onChange }: { value: "ADMIN" | "USER"; onChange: (v: "ADMIN" | "USER") => void }) {
  return <div className="grid gap-2"><Label>Rol</Label><Select value={value} onValueChange={(v) => onChange(v as "ADMIN" | "USER")}><SelectTrigger><SelectValue placeholder="Selecciona rol" /></SelectTrigger><SelectContent><SelectItem value="USER">USER</SelectItem><SelectItem value="ADMIN">ADMIN</SelectItem></SelectContent></Select></div>
}
