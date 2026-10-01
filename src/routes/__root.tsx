import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import SiteHeader from '@/components/site-header'

import '../styles.css'

const siteName = 'The Farm Notebook'
const siteDescription =
  'A personal Stanford blog with an interactive campus map and a weekly class timetable.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,50;1,9..144,400..700,50&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cardinal">
        Off the map
      </p>
      <h1 className="font-display mt-3 text-4xl">This page wandered off.</h1>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-cardinal px-5 py-2.5 text-sm font-medium text-white"
      >
        Back to the journal
      </Link>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <footer className="mt-24 border-t border-sandstone/70">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display italic">The Farm Notebook — notes from Stanford.</p>
            <p className="font-mono text-xs">
              Map data © OpenStreetMap contributors · Locations approximate
            </p>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
