import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { marked } from 'marked'

import { allPosts } from 'content-collections'

import { PostCard, formatPostDate, sortPosts } from '@/components/blog-posts'
import { cdnImage } from '@/lib/image'

export const Route = createFileRoute('/posts/$slug')({
  loader: async ({ params }) => {
    const post = allPosts.find((post) => post.slug === params.slug)
    if (!post) {
      throw notFound()
    }
    const more = sortPosts(allPosts.filter((p) => p.slug !== post.slug)).slice(0, 2)
    return { post, more }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — The Farm Notebook` },
          { name: 'description', content: loaderData.post.summary },
        ]
      : [],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { post, more } = Route.useLoaderData()

  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 pt-14">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-cardinal">
          ← Journal
        </Link>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.categories.map((c) => (
            <Link
              key={c}
              to="/category/$category"
              params={{ category: c }}
              className="rounded-full border border-cardinal/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cardinal hover:bg-cardinal hover:text-white"
            >
              {c}
            </Link>
          ))}
        </div>
        <h1 className="font-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{post.summary}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-ink-soft">
          {formatPostDate(post.date)}
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-5xl px-6">
        <img
          src={cdnImage(post.image, 1400)}
          alt=""
          className="aspect-[16/8] w-full rounded-2xl object-cover"
        />
      </div>
      <div
        className="prose-farm mx-auto mt-6 max-w-3xl px-6"
        dangerouslySetInnerHTML={{ __html: marked(post.content) }}
      />
      {more.length > 0 && (
        <section className="mx-auto mt-20 max-w-5xl px-6">
          <h2 className="font-display text-2xl font-semibold">Keep reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {more.map((p) => (
              <PostCard key={p._meta.path} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
