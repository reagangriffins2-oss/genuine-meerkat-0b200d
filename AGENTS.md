# AGENTS.md

## Project overview

**The Farm Notebook** — a personal Stanford blog plus two wayfinding tools: an interactive campus map and a weekly timetable. Built with TanStack Start, deployed on Netlify.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19, TanStack Router file routes, server functions) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 — theme tokens in `src/styles.css` (`cardinal`, `paper`, `ink`, `sandstone`, `palo`, `sage`; fonts Fraunces / Inter / JetBrains Mono) |
| Content | Content Collections — Markdown in `content/posts/` |
| Map | Leaflet 1.9 + OpenStreetMap tiles |
| Data | Netlify Database (Postgres) via `drizzle-orm@beta` (`drizzle-orm/netlify-db`) |
| Images | Generated illustrations in `public/img/`, served via Netlify Image CDN (`src/lib/image.ts`) |

## Key directories

```
content/posts/              Blog posts (frontmatter: date, title, summary, categories[], image)
db/schema.ts                Drizzle schema (timetable_entries)
db/index.ts                 Drizzle client
netlify/database/migrations Generated migrations — never edit applied ones
src/data/places.ts          Campus places, categories, distance/travel-time helpers
src/lib/timetable.ts        Day/time helpers, colours, sample week, anonymous owner id
src/server/timetable.functions.ts  Server functions: list/create/update/delete entries
src/components/campus-map.tsx      Client-only Leaflet wrapper
src/components/up-next.tsx         "Happening now / up next" card on the home page
src/routes/                 index (home + journal), posts.$slug, category.$category, map, timetable
```

## Non-obvious decisions

- **No accounts.** Each browser gets an anonymous UUID (`localStorage['farm-notebook-owner']`) that scopes its timetable rows (`owner_id`). Every server function filters by owner id. If real sign-in is added later, migrate rows by mapping owner id → user id.
- **`day` is Monday-first**: 0 = Monday … 6 = Sunday. Times are stored as minutes since midnight.
- **Leaflet is imported dynamically** inside `useEffect` because it touches `window`; its CSS is linked from the `/map` route `head()` via `leaflet/dist/leaflet.css?url`. Markers use `L.divIcon` (no image assets).
- **Map ↔ timetable link**: `/map?place=<placeId>` selects and flies to a place. Timetable entries store `place_id` matching `src/data/places.ts` ids — don't rename ids without a data migration.
- Travel times are estimates: straight-line distance × 1.25, walking 80 m/min, biking 250 m/min.
- The post slug is derived from the title in `content-collections.ts`.

## Conventions

- Components PascalCase, files kebab-case, `@/` alias for `src/`.
- Server functions use `.inputValidator(zodSchema)` (not `.validator`).
- Schema changes: edit `db/schema.ts` then `npx drizzle-kit generate --name <snake_case>`. Never run migrate/push.
