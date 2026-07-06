import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Sezione 4: ieri, pronostici vs risultati.
// L'endpoint NON espone esiti (verificato 06/07): il verdetto del
// mercato_top si deriva client-side da gol_casa/gol_trasferta + stats,
// come fa la home v1. Parsing keyword sulla stringa display: rattoppo
// dichiarato fino al refactor constants.py (agosto). Regola: mercato
// non riconosciuto o dati mancanti -> NESSUN badge, mai un verdetto finto.

const STATI_CONCLUSI = ['FT', 'AET', 'PEN']

function estraiLinea(m) {
  const mm = m.match(/(\d+)[.,](\d)/)
  return mm ? parseFloat(`${mm[1]}.${mm[2]}`) : null
}

function gradaMercatoTop(s) {
  if (!STATI_CONCLUSI.includes(s.stato)) return null
  const m = (s.mercato_top || '').toLowerCase()
  const gh = s.gol_casa, ga = s.gol_trasferta
  if (!m || gh == null || ga == null) return null
  const casa = (s.squadra_casa || '').toLowerCase()
  const tra = (s.squadra_trasferta || '').toLowerCase()
  const over = m.includes('over'), under = m.includes('under')
  const linea = estraiLinea(m)
  const ok = v => (v ? 'WIN' : 'LOSS')

  // Ammonizioni (richiede stats)
  if (m.includes('amm')) {
    const ac = s.stats_casa?.ammonizioni, at = s.stats_trasferta?.ammonizioni
    if (ac == null || at == null || linea == null) return null
    const tot = ac + at
    return ok(over ? tot > linea : tot < linea)
  }
  // Angoli (totale o per squadra nominata)
  if (m.includes('angol')) {
    const angC = s.stats_casa?.angoli, angT = s.stats_trasferta?.angoli
    if (angC == null || angT == null || linea == null) return null
    let v = angC + angT
    if (casa && m.includes(casa)) v = angC
    else if (tra && m.includes(tra)) v = angT
    return ok(over ? v > linea : v < linea)
  }
  // Gol/Gol e No Gol
  if (m.includes('no gol') || m.includes('nogol')) return ok(gh === 0 || ga === 0)
  if (m.includes('gol/gol') || m.includes('btts')) return ok(gh > 0 && ga > 0)
  // Vittoria <squadra>
  if (m.startsWith('vittoria')) {
    if (casa && m.includes(casa)) return ok(gh > ga)
    if (tra && m.includes(tra)) return ok(ga > gh)
    return null
  }
  // Doppia chance <a>/<b> (nomi squadra e/o 'pareggio')
  if (m.includes('doppia chance')) {
    const reale = gh > ga ? '1' : ga > gh ? '2' : 'X'
    const set = new Set()
    if (casa && m.includes(casa)) set.add('1')
    if (tra && m.includes(tra)) set.add('2')
    if (m.includes('pareggio')) set.add('X')
    return set.size >= 2 ? ok(set.has(reale)) : null
  }
  // Over/Under gol generico (ultimo: dopo amm/angoli)
  if ((over || under) && linea != null) {
    const tot = gh + ga
    return ok(over ? tot > linea : tot < linea)
  }
  return null
}

export default function Ieri() {
  const { data } = useQuery({ queryKey: ['homepage'], queryFn: () => apiGet('/homepage') })
  const schede = data?.ieri?.schede || []
  if (schede.length === 0) return null
  return (
    <div>
      <div className="section-title">🗓️ Ieri: pronostici vs risultati</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {schede.map(s => {
          const esito = gradaMercatoTop(s)
          return (
            <div key={s.fixture_id} className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px' }}>
              <span style={{ flex: 1, fontSize: 13 }}>
                {s.squadra_casa} <span className="muted">vs</span> {s.squadra_trasferta}
                {s.gol_casa != null && <b style={{ marginLeft: 8 }}>{s.gol_casa}–{s.gol_trasferta}</b>}
              </span>
              <span className="muted" style={{ fontSize: 12 }}>{s.mercato_top}</span>
              {esito && (
                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                  background: esito === 'WIN' ? 'var(--green)' : 'var(--red)', color: '#0b0b0b' }}>
                  {esito}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
