import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '@/api'
import type { BlogPost } from '@/api'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Tag } from '@/components/Tag'
import { formatDate } from '@/lib/format'
import { useResource } from '../hooks/useResource'
import { btnPrimary } from '../components/fields'
import { PageHeader } from '../components/PageHeader'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function PostsPage() {
  const { status, data, error, reload } = useResource(() => api.getPosts(), [])
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await api.deletePost(pendingDelete.id)
      setPendingDelete(null)
      reload()
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />

  const posts = data ?? []

  return (
    <div>
      <PageHeader
        title="博客"
        subtitle="管理文章列表"
        actions={
          <Link to="/admin/posts/new" className={btnPrimary}>
            <Plus size={16} aria-hidden="true" />
            新建文章
          </Link>
        }
      />

      {posts.length === 0 && <EmptyNotice message="暂无文章，点击右上角新建。" />}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line/60 bg-surface p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{post.title}</p>
                {post.draft && <Tag>草稿</Tag>}
              </div>
              <p className="text-sm text-ink-secondary">
                {formatDate(post.publishedAt)} · {post.readingMinutes} 分钟
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/admin/posts/${post.id}/edit`}
                aria-label={`编辑 ${post.title}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-ink"
              >
                <Pencil size={15} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setPendingDelete(post)}
                aria-label={`删除 ${post.title}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-danger"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="删除文章"
        message={`确定删除「${pendingDelete?.title ?? ''}」吗？此操作不可撤销。`}
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
