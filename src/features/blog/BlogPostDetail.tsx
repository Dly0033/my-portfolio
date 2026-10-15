import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { api } from '@/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatDate } from '@/lib/format'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Tag } from '@/components/Tag'

export function BlogPostDetail({ slug }: { slug: string }) {
  const { status, data, error } = useAsyncData(() => api.getPost(slug), [slug])

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Link to="/blog" className="mb-6 inline-block text-sm text-ink-secondary hover:text-accent">
        ← 返回博客
      </Link>

      {status === 'loading' && <Loading />}
      {status === 'error' && <ErrorNotice message={error.message} />}
      {status === 'success' && !data && <EmptyNotice message="文章不存在。" />}
      {status === 'success' && data && (
        <article>
          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{data.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
              <time dateTime={data.publishedAt}>{formatDate(data.publishedAt)}</time>
              <span>·</span>
              <span>{data.readingMinutes} 分钟</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </header>

          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
          </div>
        </article>
      )}
    </div>
  )
}
