import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 1: PROSSIMO TURNO (l'endpoint serve il turno, non il giorno —
// il titolo precedente "Oggi in campo" contraddiceva la strip).
// Le partite non odierne mostrano la data accanto all'orario.
export default function OggiInCampo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => apiGet('/homepage')
  })
  if (isLoading) return <div className="card muted">Caricamento partite…</div>
  if (error) return <div className="card muted">API homepage non raggiungibile: {String(error.message)}</div>
  const schede = data?.prossimo_turno?.schede || []
  const oggi = new Date().toISOString().slice(0, 10)
  return (
    <div>
      <div className="section-title">⚽ Prossimo turno</div>
      {schede.length === 0 && <div className="card muted">Nessuna partita con scheda in arrivo.</div>}
      <div style={{ display: 'grid', gap: 8 }}>
        {schede.map(s => {
          const giorno = (s.data_partita || s.data_ora || '').slice(0, 10)
          const nonOggi = giorno && giorno !== oggi
          return (
            <div key={s.fixture_id} className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="muted" style={{ fontSize: 11, minWidth: 72, textAlign: 'left' }}>
                {nonOggi && <b style={{ color: 'var(--text)' }}>{giorno.slice(8,10)}/{giorno.slice(5,7)} </b>}
                {(s.data_ora || '').slice(11, 16) || '—'}
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>
                {s.squadra_casa} <span className="muted">vs</span> {s.squadra_trasferta}
              </span>
              <span className="muted" style={{ fontSize: 10 }}>{s.campionato}</span>
              {s.mercato_top && (
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
                  {s.mercato_top} <span className="muted">({s.score_top})</span>
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
