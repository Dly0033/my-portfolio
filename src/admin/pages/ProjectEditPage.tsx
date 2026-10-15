import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '@/api'
import type { Project } from '@/api'
import { ErrorNotice, Loading } from '@/components/Status'
import { slugify } from '@/lib/format'
import { useResource } from '../hooks/useResource'
import {
  parseIntOrUndefined,
  projectFormSchema,
  splitLines,
  splitTags,
  toFieldErrors,
} from '../schemas'
import { btnPrimary, btnSecondary, Checkbox, TextArea, TextInput } from '../components/fields'
import { PageHeader } from '../components/PageHeader'

interface FormState {
  title: string
  slug: string
  summary: string
  cover: string
  techTags: string
  live: string
  source: string
  featured: boolean
  order: string
  createdAt: string
  background: string
  goals: string
  responsibilities: string
  outcomes: string
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  summary: '',
  cover: '',
  techTags: '',
  live: '',
  source: '',
  featured: false,
  order: '0',
  createdAt: new Date().toISOString().slice(0, 10),
  background: '',
  goals: '',
  responsibilities: '',
  outcomes: '',
}

function toForm(project: Project): FormState {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    cover: project.cover ?? '',
    techTags: project.techTags.join(', '),
    live: project.links.live ?? '',
    source: project.links.source ?? '',
    featured: project.featured,
    order: String(project.order),
    createdAt: project.createdAt.slice(0, 10),
    background: project.detail?.background ?? '',
    goals: project.detail?.goals?.join('\n') ?? '',
    responsibilities: project.detail?.responsibilities?.join('\n') ?? '',
    outcomes: project.detail?.outcomes?.join('\n') ?? '',
  }
}

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { status, data, error } = useResource(
    () => (isEdit ? api.getProjects() : Promise.resolve([] as Project[])),
    [id],
  )

  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (isEdit && status === 'success' && data) {
      const project = data.find((p) => p.id === id)
      if (project) setForm(toForm(project))
    }
  }, [isEdit, status, data, id])

  if (isEdit && status === 'loading') return <Loading />
  if (isEdit && status === 'error') return <ErrorNotice message={error.message} />

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({ ...prev, title: value, slug: prev.slug ? prev.slug : slugify(value) }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveError('')

    const parsed = projectFormSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const project: Project = {
        id: id ?? `project-${Date.now()}`,
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim(),
        cover: form.cover.trim() || undefined,
        techTags: splitTags(form.techTags),
        links: {
          live: form.live.trim() || undefined,
          source: form.source.trim() || undefined,
        },
        featured: form.featured,
        order: parseIntOrUndefined(form.order) ?? 0,
        createdAt: new Date(form.createdAt).toISOString(),
        detail: {
          background: form.background.trim() || undefined,
          goals: splitLines(form.goals),
          responsibilities: splitLines(form.responsibilities),
          outcomes: splitLines(form.outcomes),
        },
      }
      if (isEdit && id) await api.updateProject(id, project)
      else await api.createProject(project)
      navigate('/admin/projects')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '保存失败，请重试。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑项目' : '新建项目'}
        actions={
          <Link to="/admin/projects" className={btnSecondary}>
            <ArrowLeft size={16} aria-hidden="true" />
            返回列表
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="project-title"
            label="标题"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            error={errors.title}
          />
          <TextInput
            id="project-slug"
            label="标识（slug）"
            value={form.slug}
            onChange={(e) => setField('slug', e.target.value)}
            error={errors.slug}
          />
        </div>

        <TextArea
          id="project-summary"
          label="简介"
          rows={3}
          value={form.summary}
          onChange={(e) => setField('summary', e.target.value)}
          error={errors.summary}
        />
        <TextInput
          id="project-techTags"
          label="技术标签（逗号分隔）"
          value={form.techTags}
          onChange={(e) => setField('techTags', e.target.value)}
          error={errors.techTags}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="project-cover"
            label="封面 URL"
            value={form.cover}
            onChange={(e) => setField('cover', e.target.value)}
            optional
          />
          <TextInput
            id="project-createdAt"
            label="日期"
            type="date"
            value={form.createdAt}
            onChange={(e) => setField('createdAt', e.target.value)}
            error={errors.createdAt}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="project-live"
            label="在线地址"
            value={form.live}
            onChange={(e) => setField('live', e.target.value)}
            optional
          />
          <TextInput
            id="project-source"
            label="源码地址"
            value={form.source}
            onChange={(e) => setField('source', e.target.value)}
            optional
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="project-order"
            label="排序权重"
            inputMode="numeric"
            value={form.order}
            onChange={(e) => setField('order', e.target.value)}
            error={errors.order}
          />
          <div className="flex items-end pb-2.5">
            <Checkbox
              id="project-featured"
              label="精选（置顶展示）"
              checked={form.featured}
              onChange={(e) => setField('featured', e.target.checked)}
            />
          </div>
        </div>

        <fieldset className="space-y-4 rounded-xl border border-line/60 p-4">
          <legend className="px-1 text-sm font-medium">详情</legend>
          <TextArea
            id="project-background"
            label="背景"
            rows={2}
            value={form.background}
            onChange={(e) => setField('background', e.target.value)}
            optional
          />
          <TextArea
            id="project-goals"
            label="目标（每行一条）"
            rows={3}
            value={form.goals}
            onChange={(e) => setField('goals', e.target.value)}
            optional
          />
          <TextArea
            id="project-responsibilities"
            label="我的职责（每行一条）"
            rows={3}
            value={form.responsibilities}
            onChange={(e) => setField('responsibilities', e.target.value)}
            optional
          />
          <TextArea
            id="project-outcomes"
            label="成果（每行一条）"
            rows={3}
            value={form.outcomes}
            onChange={(e) => setField('outcomes', e.target.value)}
            optional
          />
        </fieldset>

        {saveError && (
          <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {saveError}
          </p>
        )}

        <button type="submit" disabled={saving} className={btnPrimary}>
          <Save size={16} aria-hidden="true" />
          {saving ? '保存中…' : '保存'}
        </button>
      </form>
    </div>
  )
}
