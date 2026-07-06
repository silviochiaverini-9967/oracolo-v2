// Client API minimale. Same-origin in produzione (/v2 -> /analisi).
const BASE = import.meta.env.VITE_API_BASE || '/analisi'

export async function apiGet(path) {
  const r = await fetch(`${BASE}${path}`)
  if (!r.ok) throw new Error(`${r.status} ${path}`)
  return r.json()
}
