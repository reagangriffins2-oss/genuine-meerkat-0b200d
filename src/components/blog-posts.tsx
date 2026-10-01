import { Link } from '@tanstack/react-router'

import { type Post } from 'content-collections'

import { cdnImage } from '@/lib/image'

export function formatPostDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      to="/posts/$slug"
      params={{ slug: post.slug }}
      className={`group block overflow-hidden rounded-2xl border border-sandstone/70 bg-white/60 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgb(90_60_30/0.35)] ${
        featured ? 'md:grid md:grid-cols-[1.2fr_1fr]' : ''
      }`}
    >
      <div className={`overflow-hidden ${featured ? 'aspect-[16/10] md:aspect-auto md:h-full' : 'aspect-[16/10]'}`}>
        <img
          src={cdnImage(post.image, featured ? 1100 : 640)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <article className={featured ? 'flex flex-col justify-center p-8' : 'p-6'}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
          <span>{formatPostDate(post.date)}</span>
          {post.categories.map((c) => (
            <span key={c} className="text-cardinal">
              · {c}
            </span>
          ))}
        </div>
        <h3
          className={`font-display mt-3 font-semibold leading-tight group-hover:text-cardinal ${
            featured ? 'text-3xl' : 'text-xl'
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 text-ink-soft">{post.summary}</p>
        <span className="mt-5 inline-block text-sm font-medium text-cardinal">
          Read the entry →
        </span>
      </article>
    </Link>
  )
}

export default function BlogPosts({
  title,
  posts,
}: {
  title: string
  posts: Post[]
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Link to="/" className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-cardinal">
        ← All entries
      </Link>
      <h1 className="font-display mt-3 text-4xl font-semibold">{title}</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortPosts(posts).map((post) => (
          <PostCard key={post._meta.path} post={post} />
        ))}
      </div>
    </div>
  )
}
