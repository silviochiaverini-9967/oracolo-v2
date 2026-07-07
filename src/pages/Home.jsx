import StripStato from '../components/StripStato.jsx'
import OggiInCampo from '../components/OggiInCampo.jsx'
import TrackRecord from '../components/TrackRecord.jsx'
import Ieri from '../components/Ieri.jsx'

// Home migrata: gli stessi 4 componenti F1a.1, ora dentro la shell.
// Ristrutturazione mobile-first dei singoli componenti: step successivo.
export default function Home() {
  return (
    <div className="grid gap-6">
      <StripStato />
      <OggiInCampo />
      <TrackRecord />
      <Ieri />
    </div>
  )
}
