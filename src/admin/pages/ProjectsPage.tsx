import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '@/api'
import type { Project } from '@/api'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Tag } from '@/components/Tag'
import { useResource } from '../hooks/useResource'
import { btnPrimary } from '../components/fields'
import { PageHeader } from '../components/PageHeader'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function ProjectsPage() {
  const { status, data, error, reload } = useResource(() => api.getProjects(), [])
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await api.deleteProject(pendingDelete.id)
      setPendingDelete(null)
      reload()
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />

  const projects = data ?? []

  return (
    <div>
      <PageHeader
        title="项目"
        subtitle="管理项目列表"
        actions={
          <Link to="/admin/projects/new" className={btnPrimary}>
            <Plus size={16} aria-hidden="true" />
            新建项目
          </Link>
        }
      />

      {projects.length === 0 && <EmptyNotice message="暂无项目，点击右上角新建。" />}

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line/60 bg-surface p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{project.title}</p>
                {project.featured && <Tag>精选</Tag>}
              </div>
              <p className="truncate text-sm text-ink-secondary">{project.summary}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/admin/projects/${project.id}/edit`}
                aria-label={`编辑 ${project.title}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-ink"
              >
                <Pencil size={15} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setPendingDelete(project)}
                aria-label={`删除 ${project.title}`}
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
        title="删除项目"
        message={`确定删除「${pendingDelete?.title ?? ''}」吗？此操作不可撤销。`}
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
