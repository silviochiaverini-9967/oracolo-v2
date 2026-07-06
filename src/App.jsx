import StripStato from './components/StripStato.jsx'
import OggiInCampo from './components/OggiInCampo.jsx'
import TrackRecord from './components/TrackRecord.jsx'
import Ieri from './components/Ieri.jsx'

export default function App() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px 40px',
      display: 'grid', gap: 22 }}>
      <StripStato />
      <OggiInCampo />
      <TrackRecord />
      <Ieri />
      {/* F1c: due colonne ALTA PROBABILITA' / VALORE + sezione admin (vedi HOME_V2_CONCEPT.md) */}
    </div>
  )
}
