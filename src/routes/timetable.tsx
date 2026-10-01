import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  CalendarPlus,
  Footprints,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PLACES, distanceMeters, getPlace, travelMinutes } from '@/data/places'
import {
  DAYS,
  DAY_NAMES,
  ENTRY_COLORS,
  type EntryDraft,
  SAMPLE_WEEK,
  type TimetableEntry,
  colorFor,
  formatTime,
  fromInputTime,
  getOwnerId,
  nowInWeek,
  toInputTime,
  upNext,
} from '@/lib/timetable'
import {
  createEntries,
  deleteEntry,
  listEntries,
  updateEntry,
} from '@/server/timetable.functions'

export const Route = createFileRoute('/timetable')({
  head: () => ({ meta: [{ title: 'Timetable — The Farm Notebook' }] }),
  component: TimetablePage,
})

const HOUR_PX = 56

type Editor =
  | { mode: 'create'; days: number[]; draft: EntryDraft }
  | { mode: 'edit'; id: number; day: number; draft: EntryDraft }

const blankDraft = (startMinutes = 9 * 60): EntryDraft => ({
  title: '',
  code: '',
  placeId: '',
  room: '',
  startMinutes,
  endMinutes: startMinutes + 50,
  color: 'cardinal',
})

function TimetablePage() {
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [entries, setEntries] = useState<TimetableEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [now, setNow] = useState(() => nowInWeek())

  useEffect(() => {
    const id = getOwnerId()
    setOwnerId(id)
    listEntries({ data: { ownerId: id } })
      .then(setEntries)
      .catch(() => {
        setEntries([])
        setError('Couldn’t load your timetable. Try refreshing.')
      })
    const t = setInterval(() => setNow(nowInWeek()), 60_000)
    return () => clearInterval(t)
  }, [])

  const showWeekend = useMemo(
    () => (entries ?? []).some((e) => e.day >= 5),
    [entries],
  )
  const visibleDays = showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4]

  const [startHour, endHour] = useMemo(() => {
    let lo = 8
    let hi = 19
    for (const e of entries ?? []) {
      lo = Math.min(lo, Math.floor(e.startMinutes / 60))
      hi = Math.max(hi, Math.ceil(e.endMinutes / 60))
    }
    return [lo, hi]
  }, [entries])

  const loadSample = async () => {
    if (!ownerId) return
    setSeeding(true)
    try {
      const created = await Promise.all(
        SAMPLE_WEEK.map((s) =>
          createEntries({ data: { ownerId, days: s.days, entry: s.entry } }),
        ),
      )
      setEntries((prev) => [...(prev ?? []), ...created.flat()])
    } catch {
      setError('Couldn’t add the sample week.')
    } finally {
      setSeeding(false)
    }
  }

  const today = now.day
  const todays = (entries ?? [])
    .filter((e) => e.day === today)
    .sort((a, b) => a.startMinutes - b.startMinutes)
  const { current, next } = upNext(entries ?? [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cardinal">
            Planning
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
            My weekly timetable
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Every class is tied to a building, so you can jump straight to the
            map — and see if you have enough time to walk between them.
          </p>
        </div>
        <button
          onClick={() => setEditor({ mode: 'create', days: [today <= 4 ? today : 0], draft: blankDraft() })}
          disabled={!ownerId}
          className="inline-flex items-center gap-2 rounded-full bg-cardinal px-5 py-3 text-sm font-medium text-white shadow-lg shadow-cardinal/20 hover:bg-cardinal-dark disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add a class
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-cardinal/10 px-4 py-3 text-sm text-cardinal">
          {error}
        </p>
      )}

      {entries === null ? (
        <div className="mt-10 flex items-center gap-3 text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading your week…
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sandstone bg-white/50 px-6 py-16 text-center">
          <CalendarPlus className="mx-auto h-10 w-10 text-cardinal" />
          <h2 className="font-display mt-4 text-2xl font-semibold">
            Your week is wide open.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            Add your classes one at a time, or start from a typical first-year
            week and edit it to match yours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setEditor({ mode: 'create', days: [0], draft: blankDraft() })}
              className="rounded-full bg-cardinal px-5 py-2.5 text-sm font-medium text-white hover:bg-cardinal-dark"
            >
              Add my first class
            </button>
            <button
              onClick={loadSample}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-medium hover:border-cardinal hover:text-cardinal disabled:opacity-60"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Load a sample week
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Week grid */}
          <div className="overflow-x-auto rounded-2xl border border-sandstone/70 bg-white/60">
            <div
              className="grid min-w-[680px]"
              style={{ gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)` }}
            >
              <div className="border-b border-sandstone/70" />
              {visibleDays.map((d) => (
                <div
                  key={d}
                  className={`border-b border-l border-sandstone/70 py-3 text-center font-mono text-xs uppercase tracking-[0.15em] ${
                    d === today ? 'bg-cardinal text-white' : 'text-ink-soft'
                  }`}
                >
                  {DAYS[d]}
                </div>
              ))}

              {/* Hour labels */}
              <div className="relative" style={{ height: (endHour - startHour) * HOUR_PX }}>
                {Array.from({ length: endHour - startHour }, (_, i) => (
                  <div
                    key={i}
                    className="absolute right-2 -translate-y-1/2 font-mono text-[10px] text-ink-soft"
                    style={{ top: i * HOUR_PX }}
                  >
                    {i === 0 ? '' : formatTime((startHour + i) * 60).replace(':00', '')}
                  </div>
                ))}
              </div>

              {visibleDays.map((d) => (
                <div
                  key={d}
                  className={`relative border-l border-sandstone/70 ${d === today ? 'bg-cardinal/[0.03]' : ''}`}
                  style={{
                    height: (endHour - startHour) * HOUR_PX,
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${HOUR_PX - 1}px, rgb(217 197 160 / 0.5) ${HOUR_PX - 1}px, rgb(217 197 160 / 0.5) ${HOUR_PX}px)`,
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const mins = startHour * 60 + ((e.clientY - rect.top) / HOUR_PX) * 60
                    const snapped = Math.floor(mins / 30) * 30
                    setEditor({ mode: 'create', days: [d], draft: blankDraft(snapped) })
                  }}
                >
                  {d === today &&
                    now.minutes >= startHour * 60 &&
                    now.minutes <= endHour * 60 && (
                      <div
                        className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-cardinal"
                        style={{ top: ((now.minutes - startHour * 60) / 60) * HOUR_PX }}
                      >
                        <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-cardinal" />
                      </div>
                    )}
                  {(entries ?? [])
                    .filter((e) => e.day === d)
                    .map((e) => {
                      const c = colorFor(e.color)
                      const top = ((e.startMinutes - startHour * 60) / 60) * HOUR_PX
                      const height = Math.max(((e.endMinutes - e.startMinutes) / 60) * HOUR_PX, 22)
                      const place = getPlace(e.placeId)
                      return (
                        <button
                          key={e.id}
                          onClick={(ev) => {
                            ev.stopPropagation()
                            const { id, day, title, code, placeId, room, startMinutes, endMinutes, color } = e
                            setEditor({ mode: 'edit', id, day, draft: { title, code, placeId, room, startMinutes, endMinutes, color } })
                          }}
                          className="absolute inset-x-1 overflow-hidden rounded-lg border-l-4 px-2 py-1 text-left text-xs shadow-sm transition hover:z-20 hover:shadow-md"
                          style={{ top, height, background: c.bg, borderColor: c.border, color: c.text }}
                        >
                          <span className="block truncate font-semibold">
                            {e.code || e.title}
                          </span>
                          {height > 34 && (
                            <span className="block truncate opacity-80">
                              {formatTime(e.startMinutes)}
                              {place ? ` · ${place.name.split(' (')[0]}` : ''}
                            </span>
                          )}
                        </button>
                      )
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* Today */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-sandstone/70 bg-white/70 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cardinal">
                {DAY_NAMES[today]}
              </p>
              <h2 className="font-display mt-1 text-2xl font-semibold">Today’s route</h2>
              {todays.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">No classes today. 🌴</p>
              ) : (
                <ol className="mt-4 space-y-1">
                  {todays.map((e, i) => {
                    const place = getPlace(e.placeId)
                    const prev = todays[i - 1]
                    const prevPlace = getPlace(prev?.placeId)
                    const isNow = current?.id === e.id
                    const isNext = !current && next?.id === e.id
                    const done = e.endMinutes <= now.minutes
                    return (
                      <li key={e.id}>
                        {prev && place && prevPlace && prevPlace.id !== place.id && (
                          <TransferNote
                            gap={e.startMinutes - prev.endMinutes}
                            walk={travelMinutes(distanceMeters(prevPlace, place)).walk}
                          />
                        )}
                        <div
                          className={`rounded-xl border px-3 py-2.5 ${
                            isNow || isNext ? 'border-cardinal bg-cardinal/5' : 'border-transparent'
                          } ${done ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] text-ink-soft">
                              {formatTime(e.startMinutes)} – {formatTime(e.endMinutes)}
                            </span>
                            {(isNow || isNext) && (
                              <span className="rounded-full bg-cardinal px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
                                {isNow ? 'Now' : 'Next'}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm font-medium">
                            {e.code ? `${e.code} · ` : ''}
                            {e.title}
                          </p>
                          {place && (
                            <Link
                              to="/map"
                              search={{ place: place.id }}
                              className="mt-1 inline-flex items-center gap-1 text-xs text-cardinal hover:underline"
                            >
                              <MapPin className="h-3 w-3" />
                              {place.name}
                              {e.room ? ` · ${e.room}` : ''}
                            </Link>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>
            <p className="px-1 text-xs text-ink-soft">
              Tip: click an empty slot on the grid to add a class at that time.
              Your timetable is saved to this browser.
            </p>
          </aside>
        </div>
      )}

      {editor && ownerId && (
        <EntryEditor
          editor={editor}
          ownerId={ownerId}
          onClose={() => setEditor(null)}
          onCreated={(rows) => setEntries((prev) => [...(prev ?? []), ...rows])}
          onUpdated={(row) =>
            setEntries((prev) => (prev ?? []).map((e) => (e.id === row.id ? row : e)))
          }
          onDeleted={(id) => setEntries((prev) => (prev ?? []).filter((e) => e.id !== id))}
        />
      )}
    </div>
  )
}

function TransferNote({ gap, walk }: { gap: number; walk: number }) {
  const tight = walk > gap
  return (
    <div
      className={`my-1 ml-3 flex items-center gap-1.5 border-l-2 border-dashed py-1 pl-3 text-[11px] ${
        tight ? 'border-cardinal text-cardinal' : 'border-sandstone text-ink-soft'
      }`}
    >
      {tight ? <AlertTriangle className="h-3 w-3" /> : <Footprints className="h-3 w-3" />}
      {walk} min walk · {gap} min gap{tight ? ' — grab a bike!' : ''}
    </div>
  )
}

function EntryEditor({
  editor,
  ownerId,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: {
  editor: Editor
  ownerId: string
  onClose: () => void
  onCreated: (rows: TimetableEntry[]) => void
  onUpdated: (row: TimetableEntry) => void
  onDeleted: (id: number) => void
}) {
  const [draft, setDraft] = useState<EntryDraft>(editor.draft)
  const [days, setDays] = useState<number[]>(
    editor.mode === 'create' ? editor.days : [editor.day],
  )
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const set = <K extends keyof EntryDraft>(key: K, value: EntryDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const toggleDay = (d: number) => {
    if (editor.mode === 'edit') return setDays([d])
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return setErr('Give the class a name.')
    if (days.length === 0) return setErr('Pick at least one day.')
    if (draft.endMinutes <= draft.startMinutes) return setErr('End time must be after the start.')
    setSaving(true)
    setErr(null)
    try {
      if (editor.mode === 'create') {
        onCreated(await createEntries({ data: { ownerId, days, entry: draft } }))
      } else {
        const row = await updateEntry({
          data: { ownerId, id: editor.id, day: days[0], entry: draft },
        })
        if (row) onUpdated(row)
      }
      onClose()
    } catch {
      setErr('Couldn’t save — please try again.')
      setSaving(false)
    }
  }

  const remove = async () => {
    if (editor.mode !== 'edit') return
    setSaving(true)
    try {
      await deleteEntry({ data: { ownerId, id: editor.id } })
      onDeleted(editor.id)
      onClose()
    } catch {
      setErr('Couldn’t delete — please try again.')
      setSaving(false)
    }
  }

  const input =
    'w-full rounded-lg border border-sandstone bg-white px-3 py-2 text-sm outline-none focus:border-cardinal'

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-paper p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {editor.mode === 'create' ? 'Add a class' : 'Edit class'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-paper-deep" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_120px]">
          <Field label="Class name">
            <input autoFocus className={input} value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="Programming Abstractions" />
          </Field>
          <Field label="Code">
            <input className={input} value={draft.code} onChange={(e) => set('code', e.target.value)} placeholder="CS 106B" />
          </Field>
        </div>

        <Field group label={editor.mode === 'create' ? 'Days (pick all that repeat)' : 'Day'} className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((label, d) => (
              <button
                type="button"
                key={label}
                onClick={() => toggleDay(d)}
                className={`w-12 rounded-lg border py-1.5 font-mono text-xs ${
                  days.includes(d) ? 'border-cardinal bg-cardinal text-white' : 'border-sandstone bg-white text-ink-soft'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Starts">
            <input type="time" step={300} className={input} value={toInputTime(draft.startMinutes)} onChange={(e) => e.target.value && set('startMinutes', fromInputTime(e.target.value))} />
          </Field>
          <Field label="Ends">
            <input type="time" step={300} className={input} value={toInputTime(draft.endMinutes)} onChange={(e) => e.target.value && set('endMinutes', fromInputTime(e.target.value))} />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_140px]">
          <Field label="Building">
            <select className={input} value={draft.placeId} onChange={(e) => set('placeId', e.target.value)}>
              <option value="">— None —</option>
              {[...PLACES].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Room">
            <input className={input} value={draft.room} onChange={(e) => set('room', e.target.value)} placeholder="Room 200" />
          </Field>
        </div>

        <Field group label="Colour" className="mt-4">
          <div className="flex gap-2">
            {Object.entries(ENTRY_COLORS).map(([key, c]) => (
              <button
                type="button"
                key={key}
                title={c.label}
                onClick={() => set('color', key)}
                className={`h-8 w-8 rounded-full border-2 ${draft.color === key ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''}`}
                style={{ background: c.bg, borderColor: c.border }}
              />
            ))}
          </div>
        </Field>

        {err && <p className="mt-4 text-sm text-cardinal">{err}</p>}

        <div className="mt-6 flex items-center gap-3">
          {editor.mode === 'edit' && (
            <button type="button" onClick={remove} disabled={saving} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-cardinal hover:bg-cardinal/10">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button type="button" onClick={onClose} className="ml-auto rounded-full px-4 py-2 text-sm text-ink-soft hover:bg-paper-deep">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-cardinal px-5 py-2 text-sm font-medium text-white hover:bg-cardinal-dark disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editor.mode === 'create' && days.length > 1 ? `Add to ${days.length} days` : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  className = '',
  group = false,
  children,
}: {
  label: string
  className?: string
  group?: boolean
  children: React.ReactNode
}) {
  // Button groups can't live inside a <label> (clicking the text would press the first button).
  const Tag = group ? 'div' : 'label'
  return (
    <Tag className={`block ${className}`} role={group ? 'group' : undefined} aria-label={group ? label : undefined}>
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </span>
      {children}
    </Tag>
  )
}
