import { pgTable, serial, text, integer, timestamp, index } from 'drizzle-orm/pg-core'

// One row per class/event on a visitor's weekly timetable.
// `ownerId` is an anonymous id generated in the browser, so every visitor keeps their own schedule.
export const timetableEntries = pgTable(
  'timetable_entries',
  {
    id: serial().primaryKey(),
    ownerId: text('owner_id').notNull(),
    title: text().notNull(),
    code: text().notNull().default(''),
    placeId: text('place_id').notNull().default(''),
    room: text().notNull().default(''),
    day: integer().notNull(),
    startMinutes: integer('start_minutes').notNull(),
    endMinutes: integer('end_minutes').notNull(),
    color: text().notNull().default('cardinal'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [index('timetable_owner_idx').on(t.ownerId)],
)

export type TimetableEntry = typeof timetableEntries.$inferSelect
