import { createServerFn } from '@tanstack/react-start'
import { and, asc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../../db/index.js'
import { timetableEntries } from '../../db/schema.js'

const ownerId = z.string().min(8).max(64)

const entryInput = z.object({
  title: z.string().trim().min(1).max(120),
  code: z.string().trim().max(40).default(''),
  placeId: z.string().max(60).default(''),
  room: z.string().trim().max(60).default(''),
  startMinutes: z.number().int().min(0).max(24 * 60),
  endMinutes: z.number().int().min(0).max(24 * 60),
  color: z.string().max(20).default('cardinal'),
})

export const listEntries = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ ownerId }))
  .handler(async ({ data }) => {
    return db
      .select()
      .from(timetableEntries)
      .where(eq(timetableEntries.ownerId, data.ownerId))
      .orderBy(asc(timetableEntries.day), asc(timetableEntries.startMinutes))
  })

// Creates one row per selected weekday, so "MWF 10:30" is a single form submission.
export const createEntries = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      ownerId,
      days: z.array(z.number().int().min(0).max(6)).min(1).max(7),
      entry: entryInput,
    }),
  )
  .handler(async ({ data }) => {
    if (data.entry.endMinutes <= data.entry.startMinutes) {
      throw new Error('End time must be after start time')
    }
    return db
      .insert(timetableEntries)
      .values(
        data.days.map((day) => ({ ...data.entry, day, ownerId: data.ownerId })),
      )
      .returning()
  })

export const updateEntry = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      ownerId,
      id: z.number().int(),
      day: z.number().int().min(0).max(6),
      entry: entryInput,
    }),
  )
  .handler(async ({ data }) => {
    if (data.entry.endMinutes <= data.entry.startMinutes) {
      throw new Error('End time must be after start time')
    }
    const [row] = await db
      .update(timetableEntries)
      .set({ ...data.entry, day: data.day })
      .where(
        and(
          eq(timetableEntries.id, data.id),
          eq(timetableEntries.ownerId, data.ownerId),
        ),
      )
      .returning()
    return row ?? null
  })

export const deleteEntry = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ ownerId, id: z.number().int() }))
  .handler(async ({ data }) => {
    await db
      .delete(timetableEntries)
      .where(
        and(
          eq(timetableEntries.id, data.id),
          eq(timetableEntries.ownerId, data.ownerId),
        ),
      )
    return { ok: true }
  })
