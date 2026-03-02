// ── Areas de la empresa (editar segun necesidad) ────────────
export const AREAS = [
  "Administracion",
  "Contabilidad",
  "Recursos Humanos",
  "Sistemas",
  "Comercial",
  "Logistica",
  "Produccion",
  "Gerencia",
] as const

// ── Tipos de problema (editar segun necesidad) ──────────────
export const PROBLEM_TYPES = [
  "Hardware",
  "Software",
  "Red / Conectividad",
  "Impresora",
  "Email",
  "Accesos / Permisos",
  "Telefonia",
  "Otro",
] as const

// ── API base URL ────────────────────────────────────────────
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"
