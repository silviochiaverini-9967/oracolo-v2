import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 2 (F1b): trasparenza totale. Yield mostrato SEMPRE col campione:
// "+53% su 38 giocate" — mai il numero nudo (selection bias, vedi concept).
// Le fasce score arriveranno con l'estensione endpoint lato v1.
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
              {m.con_quota > 0 && <> · yield {m.yield_pct > 0 ? '+' : ''}{m.yield_pct}% <b>su {m.con_quota} giocate</b></>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
