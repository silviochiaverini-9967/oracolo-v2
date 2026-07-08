import { Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar.jsx'
import Home from './pages/Home.jsx'
import Placeholder from './pages/Placeholder.jsx'

// Shell responsive: mobile = contenuto sopra + tab bar fissa in basso;
// desktop (md+) = tab bar-sidebar a sinistra + contenuto a destra.
export default function App() {
  return (
    <div className="mx-auto h-full max-w-5xl md:flex">
      <TabBar />
      <main className="flex-1 overflow-y-auto px-4 pb-20 pt-2 md:pb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendario" element={<Placeholder nome="Calendario" />} />
          <Route path="/scout" element={<Placeholder nome="Scout" />} />
          <Route path="/storico" element={<Placeholder nome="Storico" />} />
          {/* catch-all: path non riconosciuti (incl. /v2 senza slash) → Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}
