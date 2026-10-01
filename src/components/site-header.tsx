import { Link } from '@tanstack/react-router'
import { BookOpen, CalendarDays, Map } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Journal', icon: BookOpen },
  { to: '/map', label: 'Campus map', icon: Map },
  { to: '/timetable', label: 'Timetable', icon: CalendarDays },
] as const

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-sandstone/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cardinal font-display text-lg font-semibold text-white">
            F
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-semibold">
              The Farm Notebook
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft sm:block">
              Stanford, in my words
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/' }}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-soft transition hover:bg-paper-deep hover:text-ink"
              activeProps={{
                className: '!bg-cardinal !text-white hover:!bg-cardinal-dark',
              }}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
