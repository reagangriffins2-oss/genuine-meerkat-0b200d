import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Compass } from 'lucide-react'

import { allPosts } from 'content-collections'

import { PostCard, sortPosts } from '@/components/blog-posts'
import UpNext from '@/components/up-next'
import { PLACES } from '@/data/places'
import { cdnImage } from '@/lib/image'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const posts = sortPosts(allPosts)
  const [featured, ...rest] = posts
  const categories = [...new Set(allPosts.flatMap((p) => p.categories))].sort()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={cdnImage('/img/hero.png', 1800)}
          alt="Illustration of Stanford's Main Quad with Memorial Church and Hoover Tower"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/10" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.3fr_1fr] md:items-end md:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cardinal">
              A personal Stanford journal
            </p>
            <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Finding my way <em className="text-cardinal">around the Farm.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Notes on campus life, the shortcuts I've learned, a map that gets
              me between classes, and a timetable that tells me where to be next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-full bg-cardinal px-5 py-3 text-sm font-medium text-white shadow-lg shadow-cardinal/20 hover:bg-cardinal-dark"
              >
                <Compass className="h-4 w-4" /> Open the campus map
              </Link>
              <Link
                to="/timetable"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/70 px-5 py-3 text-sm font-medium hover:border-cardinal hover:text-cardinal"
              >
                <CalendarDays className="h-4 w-4" /> My timetable
              </Link>
            </div>
          </div>
          <UpNext />
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto mt-16 grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        <Link
          to="/map"
          className="group relative overflow-hidden rounded-2xl bg-palo p-8 text-white"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            Wayfinding
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">The campus map</h2>
          <p className="mt-3 max-w-sm text-white/80">
            {PLACES.length} pinned places — lecture halls, libraries, dining,
            dorms and shuttle stops — with walking and biking times from where
            you're standing.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
            Start exploring <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
          <Compass className="absolute -bottom-8 -right-8 h-48 w-48 text-white/10" />
        </Link>
        <Link
          to="/timetable"
          className="group relative overflow-hidden rounded-2xl bg-cardinal p-8 text-white"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            Planning
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">The weekly timetable</h2>
          <p className="mt-3 max-w-sm text-white/80">
            Lay out your classes, sections and gym time. Every block links to
            its building on the map, so you always know where to head next.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
            Plan my week <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
          <CalendarDays className="absolute -bottom-8 -right-8 h-48 w-48 text-white/10" />
        </Link>
      </section>

      {/* Journal */}
      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sandstone/70 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cardinal">
              The journal
            </p>
            <h2 className="font-display mt-2 text-4xl font-semibold">Latest entries</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                to="/category/$category"
                params={{ category: c }}
                className="rounded-full border border-sandstone px-3 py-1 text-sm text-ink-soft hover:border-cardinal hover:text-cardinal"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
        {featured && (
          <div className="mt-10">
            <PostCard post={featured} featured />
          </div>
        )}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post._meta.path} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
