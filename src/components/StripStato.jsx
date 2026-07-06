import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 0 del concept: data, N partite oggi, un rigo.
export default function StripStato() {
  const oggi = new Date().toISOString().slice(0, 10)
  const { data } = useQuery({
    queryKey: ['calendario', oggi],
    queryFn: () => apiGet(`/calendario?da=${oggi}&a=${oggi}`)
  })
  const n = data?.[oggi] ?? '—'
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'baseline',
      padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 20, fontWeight: 800 }}>
        Oracol<span style={{ color: 'var(--accent)' }}>O</span> <span className="muted" style={{ fontSize: 12 }}>v2</span>
      </span>
      <span className="muted" style={{ fontSize: 13 }}>
        {oggi.split('-').reverse().join('/')} · <b style={{ color: 'var(--text)' }}>{n}</b> partite oggi
      </span>
    </div>
  )
}
