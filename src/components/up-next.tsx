import { Link } from '@tanstack/react-router'
import { Clock, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getPlace } from '@/data/places'
import {
  type TimetableEntry,
  formatTime,
  getOwnerId,
  upNext,
} from '@/lib/timetable'
import { listEntries } from '@/server/timetable.functions'

// Small card summarising what's on right now — reads the visitor's saved timetable.
export default function UpNext() {
  const [entries, setEntries] = useState<TimetableEntry[] | null>(null)
  const [, tick] = useState(0)

  useEffect(() => {
    listEntries({ data: { ownerId: getOwnerId() } })
      .then(setEntries)
      .catch(() => setEntries([]))
    const t = setInterval(() => tick((n) => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  if (entries === null) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/50" />
  }

  const { current, next } = upNext(entries)
  const focus = current ?? next
  const place = getPlace(focus?.placeId)

  return (
    <div className="rounded-2xl border border-sandstone/70 bg-white/70 p-6 shadow-[0_12px_30px_-18px_rgb(90_60_30/0.4)] backdrop-blur">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cardinal">
        {current ? 'Happening now' : next ? 'Up next today' : 'Today'}
      </p>
      {focus ? (
        <>
          <h3 className="font-display mt-2 text-2xl font-semibold leading-tight">
            {focus.code ? `${focus.code} · ` : ''}
            {focus.title}
          </h3>
          <div className="mt-3 space-y-1.5 text-sm text-ink-soft">
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(focus.startMinutes)} – {formatTime(focus.endMinutes)}
            </p>
            {(place || focus.room) && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {[place?.name, focus.room].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {place && (
            <Link
              to="/map"
              search={{ place: place.id }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-cardinal px-4 py-2 text-sm font-medium text-white hover:bg-cardinal-dark"
            >
              <MapPin className="h-4 w-4" /> Show me the way
            </Link>
          )}
        </>
      ) : (
        <>
          <h3 className="font-display mt-2 text-2xl font-semibold">
            {entries.length ? 'Nothing else today.' : 'No classes yet.'}
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            {entries.length
              ? 'Enjoy the evening — maybe a walk around Lagunita?'
              : 'Add your classes and this card tells you where to go next.'}
          </p>
          <Link
            to="/timetable"
            className="mt-5 inline-flex rounded-full border border-cardinal px-4 py-2 text-sm font-medium text-cardinal hover:bg-cardinal hover:text-white"
          >
            {entries.length ? 'Open timetable' : 'Build my timetable'}
          </Link>
        </>
      )}
    </div>
  )
}
