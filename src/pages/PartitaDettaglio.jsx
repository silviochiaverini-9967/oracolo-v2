import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api.js'

// Dettaglio partita: header + tab bar interna.
// Fonte unica: /analisi/partita/:id/stats → {stats_disponibili, stats_casa/tra,
// media_casa/tra, gol_casa/tra, pronostici[]}.
// Tre stati gestiti: partita giocata (stats piene), futura (stats assenti ma
// pronostici presenti), pre-partita senza pronostici (nazionali senza profili).

const CATEGORIE = [
  { key: 'stat', label: 'Statistiche' },
  { key: 'risultato', label: 'Risultato' },
  { key: 'gol', label: 'Gol' },
  { key: 'angoli', label: 'Angoli' },
  { key: 'cartellini', label: 'Cartellini' },
]

// mappa i tipi mercato del backend alle categorie tab
function categoriaDi(tipo = '') {
  const t = tipo.toLowerCase()
  if (t.includes('ammon') || t.includes('cart')) return 'cartellini'
  if (t.includes('angoli') || t.includes('corner')) return 'angoli'
  if (t.includes('over') || t.includes('under') || t.includes('gol') || t.includes('btts')) return 'gol'
  if (t.includes('1x2') || t.includes('doppia') || t.includes('risultato') || t.includes('dc')) return 'risultato'
  return 'gol'
}

function ScoreBadge({ score, confidenza }) {
  const col = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--accent)' : 'var(--muted)'
  return (
    <span className="shrink-0 text-right">
      <span className="text-base font-extrabold" style={{ color: col }}>{score}</span>
      <span className="block text-[9px] uppercase tracking-wide text-muted">{confidenza}</span>
    </span>
  )
}

function EsitoBadge({ esito }) {
  if (!esito) return null
  const win = esito.toUpperCase().includes('VINT') || esito.toUpperCase() === 'WIN'
  return (
    <span className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold"
      style={{ background: win ? 'rgba(62,207,142,.15)' : 'rgba(229,83,75,.15)',
               color: win ? 'var(--green)' : 'var(--red)' }}>
      {win ? 'WIN' : 'LOSS'}
    </span>
  )
}

// Riga statistica: label centrale, valore casa a sx, trasferta a dx, barra proporzionale
function StatRow({ label, casa, tra, suffix = '' }) {
  const tot = (Number(casa) || 0) + (Number(tra) || 0)
  const pCasa = tot > 0 ? (Number(casa) / tot) * 100 : 50
  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold tabular-nums">{casa ?? '—'}{suffix}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted">{label}</span>
        <span className="font-semibold tabular-nums">{tra ?? '—'}{suffix}</span>
      </div>
      <div className="mt-1 flex h-1 overflow-hidden rounded-full bg-surface2">
        <div style={{ width: `${pCasa}%`, background: 'var(--accent)' }} />
        <div style={{ width: `${100 - pCasa}%`, background: 'var(--blue)' }} />
      </div>
    </div>
  )
}

function Vuoto({ children }) {
  return <div className="py-10 text-center text-sm text-muted">{children}</div>
}

export default function PartitaDettaglio() {
  const { fixtureId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState('stat')

  // nomi squadra: prima da location.state (click dalla home, veloce),
  // altrimenti fallback su /schede/:id (accesso via URL diretto)
  const fromState = location.state || {}
  const { data, isLoading, error } = useQuery({
    queryKey: ['partita-stats', fixtureId],
    queryFn: () => apiGet(`/partita/${fixtureId}/stats`),
  })
  const { data: scheda } = useQuery({
    queryKey: ['scheda-nomi', fixtureId],
    queryFn: () => apiGet(`/schede/${fixtureId}`),
    enabled: !fromState.casa,  // solo se i nomi non arrivano dallo state
  })
  const nomeCasa = fromState.casa || scheda?.squadra_casa || 'Casa'
  const nomeTra = fromState.trasferta || scheda?.squadra_trasferta || 'Trasferta'

  if (isLoading) return <div className="py-10 text-center text-sm text-muted">Caricamento partita…</div>
  if (error) return <div className="py-10 text-center text-sm text-muted">Partita non trovata.</div>

  const sc = data.stats_casa, st = data.stats_trasferta
  const giocata = data.stats_disponibili && sc && st
  const pron = data.pronostici || []
  const pronCat = pron.filter(p => tab !== 'stat' && categoriaDi(p.tipo) === tab)

  return (
    <div className="pb-6">
      <button onClick={() => navigate(-1)} className="mb-3 text-sm text-muted hover:text-text">← indietro</button>

      {/* header */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="text-[11px] text-muted">{fromState.campionato || scheda?.campionato || ''}</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex-1 text-right text-base font-bold">{nomeCasa}</span>
          <span className="shrink-0 px-2 text-lg font-extrabold tabular-nums">
            {giocata ? `${data.gol_casa} – ${data.gol_trasferta}` : 'vs'}
          </span>
          <span className="flex-1 text-left text-base font-bold">{nomeTra}</span>
        </div>
        {scheda?.arbitro && scheda.arbitro !== 'null' && scheda.arbitro !== '' && (
          <div className="mt-2 text-center text-[11px] text-muted">Arbitro: {scheda.arbitro}</div>
        )}
      </div>

      {/* tab bar interna — scroll orizzontale se non ci sta */}
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-border">
        {CATEGORIE.map(c => (
          <button key={c.key} onClick={() => setTab(c.key)}
            className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
              tab === c.key ? 'border-b-2 text-text' : 'text-muted hover:text-text'
            }`}
            style={tab === c.key ? { borderColor: 'var(--accent)' } : undefined}>
            {c.label}
          </button>
        ))}
      </div>

      {/* contenuto tab */}
      <div className="mt-4">
        {tab === 'stat' && (
          giocata ? (
            <div>
              <div className="mb-3 flex justify-between text-[11px] font-semibold uppercase tracking-wide">
                <span style={{ color: 'var(--accent)' }}>{nomeCasa}</span>
                <span style={{ color: 'var(--blue)' }}>{nomeTra}</span>
              </div>
              <StatRow label="Possesso" casa={sc.possesso} tra={st.possesso} suffix="%" />
              <StatRow label="Tiri totali" casa={sc.tiri_totali} tra={st.tiri_totali} />
              <StatRow label="Tiri in porta" casa={sc.tiri_porta} tra={st.tiri_porta} />
              <StatRow label="Angoli" casa={sc.angoli} tra={st.angoli} />
              <StatRow label="Falli" casa={sc.falli} tra={st.falli} />
              <StatRow label="Ammonizioni" casa={sc.ammonizioni} tra={st.ammonizioni} />
            </div>
          ) : (
            <Vuoto>Statistiche disponibili a fine partita.</Vuoto>
          )
        )}

        {tab !== 'stat' && (
          pronCat.length > 0 ? (
            <div className="grid gap-2">
              {pronCat.sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                  <span className="flex-1 text-sm font-medium">
                    {p.nome}<EsitoBadge esito={p.esito} />
                    {p.note && <span className="block text-[11px] text-muted">{p.note}</span>}
                  </span>
                  <ScoreBadge score={p.score} confidenza={p.confidenza} />
                </div>
              ))}
            </div>
          ) : (
            <Vuoto>
              {pron.length === 0
                ? 'Pronostici non disponibili per questa partita.'
                : `Nessun pronostico ${CATEGORIE.find(c => c.key === tab)?.label.toLowerCase()} per questa partita.`}
            </Vuoto>
          )
        )}
      </div>
    </div>
  )
}
