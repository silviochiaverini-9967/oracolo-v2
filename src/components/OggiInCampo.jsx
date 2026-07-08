import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 1: PROSSIMO TURNO (l'endpoint serve il turno, non il giorno).
// Le partite non odierne mostrano la data accanto all'orario.
export default function OggiInCampo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => apiGet('/homepage')
  })
  if (isLoading) return <div className="text-muted text-sm py-4">Caricamento partite…</div>
  if (error) return <div className="text-muted text-sm py-4">API non raggiungibile: {String(error.message)}</div>
  const schede = data?.prossimo_turno?.schede || []
  const oggi = new Date().toISOString().slice(0, 10)
  return (
    <div>
      <div className="text-sm font-extrabold mb-2.5">⚽ Prossimo turno</div>
      {schede.length === 0 && <div className="text-muted text-sm">Nessuna partita con scheda in arrivo.</div>}
      <div className="grid gap-2">
        {schede.map(s => {
          const giorno = (s.data_partita || s.data_ora || '').slice(0, 10)
          const nonOggi = giorno && giorno !== oggi
          return (
            <div key={s.fixture_id} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
              <span className="text-muted text-[11px] min-w-[64px] shrink-0">
                {nonOggi && <b className="text-text">{giorno.slice(8,10)}/{giorno.slice(5,7)} </b>}
                {(s.data_ora || '').slice(11, 16) || '—'}
              </span>
              <span className="flex-1 font-semibold text-[13px] leading-tight">
                {s.squadra_casa} <span className="text-muted">vs</span> {s.squadra_trasferta}
              </span>
              <span className="text-muted text-[10px] hidden sm:inline">{s.campionato}</span>
              {s.mercato_top && (
                <span className="text-[12px] font-bold shrink-0" style={{ color: 'var(--accent)' }}>
                  {s.mercato_top} <span className="text-muted">({s.score_top})</span>
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
