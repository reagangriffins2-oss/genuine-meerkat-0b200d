import type { TimetableEntry } from '../../db/schema'

export type { TimetableEntry }

// Monday-first week; `day` in the database uses 0 = Monday … 6 = Sunday.
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const ENTRY_COLORS: Record<
  string,
  { label: string; bg: string; border: string; text: string }
> = {
  cardinal: { label: 'Cardinal', bg: '#f6dede', border: '#8c1515', text: '#5a0d0d' },
  palo: { label: 'Palo Alto green', bg: '#d9ebe6', border: '#175e54', text: '#0e3d36' },
  sky: { label: 'Sky', bg: '#dbe9f7', border: '#006cb8', text: '#063f6b' },
  poppy: { label: 'Poppy', bg: '#fbe6cf', border: '#e98300', text: '#7a4200' },
  sage: { label: 'Sage', bg: '#e6ecd6', border: '#6a7f3a', text: '#3c4a1c' },
  plum: { label: 'Plum', bg: '#ece0ea', border: '#53284f', text: '#3a1b37' },
}

export function colorFor(key: string) {
  return ENTRY_COLORS[key] ?? ENTRY_COLORS.cardinal
}

export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m.toString().padStart(2, '0')}${suffix}`
}

export function toInputTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function fromInputTime(value: string) {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function nowInWeek(date = new Date()) {
  return {
    day: (date.getDay() + 6) % 7,
    minutes: date.getHours() * 60 + date.getMinutes(),
  }
}

// The class happening now, or the next one later today.
export function upNext(entries: TimetableEntry[], date = new Date()) {
  const { day, minutes } = nowInWeek(date)
  const today = entries
    .filter((e) => e.day === day && e.endMinutes > minutes)
    .sort((a, b) => a.startMinutes - b.startMinutes)
  const current = today.find((e) => e.startMinutes <= minutes)
  const next = today.find((e) => e.startMinutes > minutes)
  return { current, next, remainingToday: today.length }
}

const OWNER_KEY = 'farm-notebook-owner'

// Anonymous per-browser id so each visitor keeps their own timetable without signing up.
export function getOwnerId() {
  let id = localStorage.getItem(OWNER_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(OWNER_KEY, id)
  }
  return id
}

export type EntryDraft = {
  title: string
  code: string
  placeId: string
  room: string
  startMinutes: number
  endMinutes: number
  color: string
}

export const SAMPLE_WEEK: { days: number[]; entry: EntryDraft }[] = [
  {
    days: [0, 2, 4],
    entry: { title: 'Programming Abstractions', code: 'CS 106B', placeId: 'hewlett', room: 'Hewlett 200', startMinutes: 10 * 60 + 30, endMinutes: 11 * 60 + 20, color: 'cardinal' },
  },
  {
    days: [1, 3],
    entry: { title: 'Thinking Matters: Ethics', code: 'THINK 51', placeId: 'main-quad', room: 'Bldg 420-040', startMinutes: 9 * 60, endMinutes: 10 * 60 + 20, color: 'palo' },
  },
  {
    days: [0, 2],
    entry: { title: 'Calculus', code: 'MATH 51', placeId: 'lane-history', room: 'Room 200-002', startMinutes: 13 * 60 + 30, endMinutes: 14 * 60 + 50, color: 'sky' },
  },
  {
    days: [1, 3],
    entry: { title: 'Writing & Rhetoric', code: 'PWR 1', placeId: 'green-library', room: 'Green 118', startMinutes: 13 * 60 + 30, endMinutes: 15 * 60 + 20, color: 'poppy' },
  },
  {
    days: [3],
    entry: { title: 'CS 106B Section', code: 'CS 106B', placeId: 'gates', room: 'Gates B12', startMinutes: 16 * 60 + 30, endMinutes: 17 * 60 + 20, color: 'cardinal' },
  },
  {
    days: [0, 2, 4],
    entry: { title: 'Gym', code: '', placeId: 'aoerc', room: '', startMinutes: 17 * 60 + 30, endMinutes: 18 * 60 + 30, color: 'sage' },
  },
  {
    days: [4],
    entry: { title: 'Coffee chat', code: '', placeId: 'coupa-y2e2', room: '', startMinutes: 15 * 60, endMinutes: 16 * 60, color: 'plum' },
  },
]
