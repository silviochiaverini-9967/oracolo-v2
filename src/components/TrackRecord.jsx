import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 2: trasparenza totale = fatti, non rumore statistico.
// Lo yield compare SOLO con campione >= 30 giocate: "-10% su 3 giocate"
// non è un dato, è varianza esposta come dato.
const MIN_CAMPIONE_YIELD = 30

export default function TrackRecord() {
  const { data, error } = useQuery({
    queryKey: ['track-record'],
    queryFn: () => apiGet('/storico/track-record')
  })
  if (error || !data?.mercati) return null
  return (
    <div>
      <div className="section-title">📊 Track record del modello <span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>— numeri veri, anche quando sono brutti</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
        {data.mercati.map(m => (
          <div key={m.tipo} className="card" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{m.nome}</div>
            <div style={{ fontSize: 22, fontWeight: 800, margin: '4px 0' }}>
              {m.hit_rate}<span className="muted" style={{ fontSize: 12 }}>%</span>
            </div>
            <div className="muted" style={{ fontSize: 10.5 }}>
              {m.corretti}/{m.totale} pronostici
              {m.con_quota >= MIN_CAMPIONE_YIELD && <> · yield {m.yield_pct > 0 ? '+' : ''}{m.yield_pct}% <b>su {m.con_quota} giocate</b></>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
