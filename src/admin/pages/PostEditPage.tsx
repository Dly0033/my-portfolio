import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '@/api'
import type { BlogPost } from '@/api'
import { ErrorNotice, Loading } from '@/components/Status'
import { slugify } from '@/lib/format'
import { useResource } from '../hooks/useResource'
import { parseIntOrUndefined, postFormSchema, splitTags, toFieldErrors } from '../schemas'
import { btnPrimary, btnSecondary, Checkbox, TextArea, TextInput } from '../components/fields'
import { MarkdownEditor } from '../components/MarkdownEditor'
import { PageHeader } from '../components/PageHeader'

interface FormState {
  title: string
  slug: string
  excerpt: string
  tags: string
  cover: string
  publishedAt: string
  readingMinutes: string
  draft: boolean
  content: string
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  tags: '',
  cover: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  readingMinutes: '3',
  draft: false,
  content: '',
}

function toForm(post: BlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    tags: post.tags.join(', '),
    cover: post.cover ?? '',
    publishedAt: post.publishedAt.slice(0, 10),
    readingMinutes: String(post.readingMinutes),
    draft: Boolean(post.draft),
    content: post.content,
  }
}

export function PostEditPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { status, data, error } = useResource(
    () => (isEdit ? api.getPosts() : Promise.resolve([] as BlogPost[])),
    [id],
  )

  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (isEdit && status === 'success' && data) {
      const post = data.find((p) => p.id === id)
      if (post) setForm(toForm(post))
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

    const parsed = postFormSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const post: BlogPost = {
        id: id ?? `post-${Date.now()}`,
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        tags: splitTags(form.tags),
        publishedAt: new Date(form.publishedAt).toISOString(),
        readingMinutes: parseIntOrUndefined(form.readingMinutes) ?? 1,
        cover: form.cover.trim() || undefined,
        draft: form.draft || undefined,
      }
      if (isEdit && id) await api.updatePost(id, post)
      else await api.createPost(post)
      navigate('/admin/posts')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '保存失败，请重试。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑文章' : '新建文章'}
        actions={
          <Link to="/admin/posts" className={btnSecondary}>
            <ArrowLeft size={16} aria-hidden="true" />
            返回列表
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="post-title"
            label="标题"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            error={errors.title}
          />
          <TextInput
            id="post-slug"
            label="标识（slug）"
            value={form.slug}
            onChange={(e) => setField('slug', e.target.value)}
            error={errors.slug}
          />
        </div>

        <TextArea
          id="post-excerpt"
          label="摘要"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setField('excerpt', e.target.value)}
          error={errors.excerpt}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <TextInput
            id="post-tags"
            label="标签（逗号分隔）"
            value={form.tags}
            onChange={(e) => setField('tags', e.target.value)}
          />
          <TextInput
            id="post-cover"
            label="封面 URL"
            value={form.cover}
            onChange={(e) => setField('cover', e.target.value)}
            optional
          />
          <TextInput
            id="post-readingMinutes"
            label="阅读时长（分钟）"
            inputMode="numeric"
            value={form.readingMinutes}
            onChange={(e) => setField('readingMinutes', e.target.value)}
            error={errors.readingMinutes}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="post-publishedAt"
            label="发布日期"
            type="date"
            value={form.publishedAt}
            onChange={(e) => setField('publishedAt', e.target.value)}
            error={errors.publishedAt}
          />
          <div className="flex items-end pb-2.5">
            <Checkbox
              id="post-draft"
              label="草稿（暂不展示）"
              checked={form.draft}
              onChange={(e) => setField('draft', e.target.checked)}
            />
          </div>
        </div>

        <MarkdownEditor
          id="post-content"
          value={form.content}
          onChange={(value) => setField('content', value)}
        />
        {errors.content && <p className="text-sm text-danger">{errors.content}</p>}

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
