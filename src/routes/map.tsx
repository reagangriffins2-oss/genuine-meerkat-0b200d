import { createFileRoute, useNavigate } from '@tanstack/react-router'
import leafletCss from 'leaflet/dist/leaflet.css?url'
import {
  Bike,
  Footprints,
  LocateFixed,
  Navigation,
  Search,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import CampusMap from '@/components/campus-map'
import {
  CATEGORY_META,
  PLACES,
  type PlaceCategory,
  directionsUrl,
  distanceMeters,
  getPlace,
  travelMinutes,
} from '@/data/places'

type MapSearch = { place?: string }

export const Route = createFileRoute('/map')({
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    place: typeof search.place === 'string' ? search.place : undefined,
  }),
  head: () => ({
    meta: [{ title: 'Campus map — The Farm Notebook' }],
    links: [{ rel: 'stylesheet', href: leafletCss }],
  }),
  component: MapPage,
})

const CATEGORIES = Object.keys(CATEGORY_META) as PlaceCategory[]

function MapPage() {
  const { place: selectedId } = Route.useSearch()
  const navigate = useNavigate({ from: '/map' })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)

  const selected = getPlace(selectedId)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PLACES.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q)),
    )
  }, [query, category])

  // Keep the selected pin visible even when it doesn't match the current filter.
  const mapPlaces = useMemo(
    () =>
      selected && !filtered.includes(selected) ? [...filtered, selected] : filtered,
    [filtered, selected],
  )

  const select = (id: string | undefined) =>
    navigate({ search: { place: id }, replace: true })

  const locate = () => {
    if (!navigator.geolocation) {
      setLocateError('Location is not available in this browser.')
      return
    }
    setLocating(true)
    setLocateError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocateError('Couldn’t get your location — check location permissions.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const travel =
    selected && userPos ? travelMinutes(distanceMeters(userPos, selected)) : null
  const distance = selected && userPos ? distanceMeters(userPos, selected) : null
  const farAway = distance !== null && distance > 8000

  return (
    <div className="flex flex-col-reverse md:h-[calc(100vh-61px)] md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full flex-col border-sandstone/70 bg-paper md:w-[380px] md:border-r">
        <div className="space-y-4 border-b border-sandstone/70 p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cardinal">
              Wayfinding
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold">Campus map</h1>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-sandstone bg-white px-3 py-2.5 focus-within:border-cardinal">
            <Search className="h-4 w-4 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buildings, food, libraries…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/70"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search">
                <X className="h-4 w-4 text-ink-soft" />
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={category === 'all'} onClick={() => setCategory('all')}>
              All
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                active={category === c}
                color={CATEGORY_META[c].color}
                onClick={() => setCategory(category === c ? 'all' : c)}
              >
                {CATEGORY_META[c].label}
              </Chip>
            ))}
          </div>
          <button
            onClick={locate}
            disabled={locating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            <LocateFixed className={`h-4 w-4 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Finding you…' : userPos ? 'Update my location' : 'Locate me'}
          </button>
          {locateError && <p className="text-xs text-cardinal">{locateError}</p>}
        </div>

        {selected && (
          <div className="border-b border-sandstone/70 bg-white/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.15em]"
                  style={{ color: CATEGORY_META[selected.category].color }}
                >
                  {CATEGORY_META[selected.category].label}
                </p>
                <h2 className="font-display mt-1 text-2xl font-semibold leading-tight">
                  {selected.name}
                </h2>
              </div>
              <button
                onClick={() => select(undefined)}
                className="rounded-full p-1 text-ink-soft hover:bg-paper-deep"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{selected.blurb}</p>
            {selected.tip && (
              <p className="mt-3 rounded-lg bg-paper-deep px-3 py-2 text-sm">
                <span className="font-semibold text-cardinal">Tip: </span>
                {selected.tip}
              </p>
            )}
            {travel && !farAway && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 rounded-lg border border-sandstone px-3 py-2">
                  <Footprints className="h-4 w-4 text-cardinal" />
                  <span>
                    <strong>{travel.walk} min</strong> walk
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-sandstone px-3 py-2">
                  <Bike className="h-4 w-4 text-palo" />
                  <span>
                    <strong>{travel.bike} min</strong> bike
                  </span>
                </div>
              </div>
            )}
            {farAway && (
              <p className="mt-4 text-xs text-ink-soft">
                You’re more than 8 km from campus, so travel estimates are hidden.
              </p>
            )}
            {!userPos && (
              <p className="mt-4 text-xs text-ink-soft">
                Tap “Locate me” to see how long it takes to get here.
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <a
                href={directionsUrl(selected, 'walking')}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cardinal px-3 py-2.5 text-sm font-medium text-white hover:bg-cardinal-dark"
              >
                <Navigation className="h-4 w-4" /> Walking directions
              </a>
              <a
                href={directionsUrl(selected, 'bicycling')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-xl border border-sandstone px-3 py-2.5 text-sm hover:border-palo hover:text-palo"
                aria-label="Biking directions"
              >
                <Bike className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        <ul className="flex-1 divide-y divide-sandstone/50 overflow-y-auto md:max-h-none">
          {filtered.map((p) => {
            const d = userPos ? distanceMeters(userPos, p) : null
            return (
              <li key={p.id}>
                <button
                  onClick={() => select(p.id)}
                  className={`flex w-full items-start gap-3 px-5 py-3 text-left transition hover:bg-white/70 ${
                    p.id === selectedId ? 'bg-white' : ''
                  }`}
                >
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CATEGORY_META[p.category].color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-ink-soft">{p.blurb}</span>
                  </span>
                  {d !== null && d < 8000 && (
                    <span className="shrink-0 font-mono text-[11px] text-ink-soft">
                      {travelMinutes(d).walk} min
                    </span>
                  )}
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-ink-soft">
              Nothing matches “{query}”.
            </li>
          )}
        </ul>
      </aside>

      {/* Map */}
      <div className="relative isolate h-[55vh] flex-1 md:h-auto">
        <CampusMap
          places={mapPlaces}
          selectedId={selectedId}
          userPos={userPos}
          onSelect={(id) => select(id)}
        />
      </div>
    </div>
  )
}

function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean
  color?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
        active
          ? 'border-ink bg-ink text-white'
          : 'border-sandstone bg-white/60 text-ink-soft hover:border-ink/40'
      }`}
    >
      {color && (
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      )}
      {children}
    </button>
  )
}
