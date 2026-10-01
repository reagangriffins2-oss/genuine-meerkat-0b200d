# The Farm Notebook

A personal Stanford blog with two built-in tools for getting around campus:

- **Journal** — Markdown blog posts about campus life, study spots, getting around and weekends.
- **Campus map** — an interactive OpenStreetMap-based map with ~40 pinned places (lecture halls, libraries, dining, dorms, rec, health, transit). Search and filter, tap *Locate me* to see walking and biking times from where you're standing, and open turn-by-turn directions in Google Maps.
- **Timetable** — a weekly class schedule. Each class is tied to a building, so "Today's route" shows the walk between consecutive classes (and warns you when the gap is too tight), and every block links straight to the map. The home page shows what's happening now / up next.

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions) on Vite 7
- Tailwind CSS 4
- [Content Collections](https://www.content-collections.dev/) for type-safe Markdown posts
- [Leaflet](https://leafletjs.com/) + OpenStreetMap tiles for the map
- [Netlify Database](https://docs.netlify.com) (managed Postgres) via Drizzle ORM for timetable storage
- Netlify Image CDN for the illustrated artwork

## Run locally

```bash
pnpm install
netlify dev   # runs the app with Netlify Database + Image CDN emulation
```

## Writing a post

Add a Markdown file to `content/posts/` with this frontmatter:

```md
---
date: 2026-10-05
title: "My post title"
summary: "One-sentence summary shown on cards."
categories:
  - Campus Life
image: /img/quad.png
---
```

## Adding places to the map

Edit `src/data/places.ts`. Each place has an id, name, category, lat/lng, a short blurb and an optional tip. Place ids are what timetable entries reference.

## Database changes

Edit `db/schema.ts`, then run `npx drizzle-kit generate --name <what_changed>`. Migrations in `netlify/database/migrations/` are applied automatically on deploy.
