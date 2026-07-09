import { NavLink } from 'react-router-dom'

// Tab bar: in basso su mobile (fixed), colonna laterale su desktop (md+).
const TABS = [
  { to: '/', label: 'Home', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/calendario', label: 'Calendario', icon: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4' },
  { to: '/scout', label: 'Scout', icon: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3' },
  { to: '/storico', label: 'Storico', icon: 'M4 19V5M4 19h16M8 15l3-3 2 2 4-5' },
]

function Icon({ d }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export default function TabBar() {
  const base = 'flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors'
  const active = 'text-accent'
  const idle = 'text-muted hover:text-text'
  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-border bg-surface
      py-1.5
      md:static md:flex-col md:justify-start md:gap-1 md:border-t-0 md:border-r md:py-4 md:w-[200px] md:h-full
    ">
      {TABS.map(t => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'}
          className={({ isActive }) => `${base} ${isActive ? active : idle} md:flex-row md:justify-start md:w-full md:gap-3 md:px-4 md:py-2.5 md:text-sm`}>
          <Icon d={t.icon} />
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
