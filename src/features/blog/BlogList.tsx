import { Link } from 'react-router-dom'
import { api } from '@/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatDate } from '@/lib/format'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Tag } from '@/components/Tag'

export function BlogList() {
  const { status, data, error } = useAsyncData(() => api.getPosts(), [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold sm:text-4xl">博客</h1>
      <p className="mb-10 text-ink-secondary">技术分享与思考</p>

      {status === 'loading' && <Loading />}
      {status === 'error' && <ErrorNotice message={error.message} />}
      {status === 'success' && (!data || data.length === 0) && <EmptyNotice message="暂无文章。" />}
      {status === 'success' && data && data.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {data.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-line/60 bg-surface p-6 transition-colors hover:border-accent/60"
            >
              <Link
                to={`/blog/${post.slug}`}
                className="mb-2 block text-xl font-semibold hover:text-accent"
              >
                {post.title}
              </Link>

              <p className="mb-4 text-sm text-ink-secondary">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-secondary">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>·</span>
                <span>{post.readingMinutes} 分钟</span>
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
