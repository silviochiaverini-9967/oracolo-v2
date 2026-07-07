import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 4: ieri, pronostici vs risultati. Trasparenza anche sui LOSS.
export default function Ieri() {
  const { data } = useQuery({ queryKey: ['homepage'], queryFn: () => apiGet('/homepage') })
  const schede = data?.ieri?.schede || []
  if (schede.length === 0) return null
  return (
    <div>
      <div className="section-title">🗓️ Ieri: pronostici vs risultati</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {schede.map(s => (
          <div key={s.fixture_id} className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px' }}>
            <span style={{ flex: 1, fontSize: 13 }}>
              {s.squadra_casa} <span className="muted">vs</span> {s.squadra_trasferta}
            </span>
            <span className="muted" style={{ fontSize: 12 }}>{s.mercato_top}</span>
            {s.esito && (
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                background: s.esito === 'WIN' ? 'var(--green)' : 'var(--red)', color: '#0b0b0b' }}>
                {s.esito}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
