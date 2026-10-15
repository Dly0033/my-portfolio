import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { api } from '@/api'
import type { Profile, SocialLink } from '@/api'
import { ErrorNotice, Loading } from '@/components/Status'
import { useResource } from '../hooks/useResource'
import {
  parseIntOrUndefined,
  profileFormSchema,
  splitLines,
  splitTags,
  toFieldErrors,
} from '../schemas'
import { btnPrimary, inputClass, TextArea, TextInput } from '../components/fields'
import { PageHeader } from '../components/PageHeader'

interface FormState {
  name: string
  tagline: string
  roles: string
  summary: string
  location: string
  email: string
  avatar: string
  yearsOfExperience: string
  projectsCount: string
  postsCount: string
}

const emptyForm: FormState = {
  name: '',
  tagline: '',
  roles: '',
  summary: '',
  location: '',
  email: '',
  avatar: '',
  yearsOfExperience: '',
  projectsCount: '',
  postsCount: '',
}

function toForm(profile: Profile): FormState {
  return {
    name: profile.name,
    tagline: profile.tagline,
    roles: profile.roles.join(', '),
    summary: profile.summary.join('\n'),
    location: profile.location ?? '',
    email: profile.email,
    avatar: profile.avatar ?? '',
    yearsOfExperience: profile.stats.yearsOfExperience?.toString() ?? '',
    projectsCount: profile.stats.projectsCount?.toString() ?? '',
    postsCount: profile.stats.postsCount?.toString() ?? '',
  }
}

export function ProfilePage() {
  const { status, data, error, reload } = useResource(() => api.getProfile(), [])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (status === 'success' && data) {
      setForm(toForm(data))
      setSocials(data.socials)
    }
  }, [status, data])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />
  if (!data) return null

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function removeSocial(index: number) {
    setSocials((prev) => prev.filter((_, i) => i !== index))
  }

  function addSocial() {
    setSocials((prev) => [...prev, { id: `social-${Date.now()}`, label: '', url: '' }])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveMsg('')

    const parsed = profileFormSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const profile: Profile = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        roles: splitTags(form.roles),
        summary: splitLines(form.summary),
        location: form.location.trim() || undefined,
        email: form.email.trim(),
        avatar: form.avatar.trim() || undefined,
        socials: socials.filter((s) => s.label.trim() || s.url.trim()),
        stats: {
          yearsOfExperience: parseIntOrUndefined(form.yearsOfExperience),
          projectsCount: parseIntOrUndefined(form.projectsCount),
          postsCount: parseIntOrUndefined(form.postsCount),
        },
      }
      await api.updateProfile(profile)
      setSaveMsg('已保存，前台刷新后即可看到变化。')
      reload()
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : '保存失败，请重试。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="个人信息" subtitle="编辑个人资料，保存后前台首页即时读取" />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5" noValidate>
        <TextInput
          id="profile-name"
          label="姓名"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
        />
        <TextInput
          id="profile-tagline"
          label="一句话定位"
          value={form.tagline}
          onChange={(e) => setField('tagline', e.target.value)}
          error={errors.tagline}
        />
        <TextInput
          id="profile-roles"
          label="角色（逗号分隔）"
          value={form.roles}
          onChange={(e) => setField('roles', e.target.value)}
          error={errors.roles}
        />
        <TextArea
          id="profile-summary"
          label="个人简介（每行一段）"
          rows={5}
          value={form.summary}
          onChange={(e) => setField('summary', e.target.value)}
          error={errors.summary}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="profile-location"
            label="所在地"
            value={form.location}
            onChange={(e) => setField('location', e.target.value)}
            optional
          />
          <TextInput
            id="profile-email"
            label="邮箱"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
          />
        </div>

        <TextInput
          id="profile-avatar"
          label="头像 URL"
          value={form.avatar}
          onChange={(e) => setField('avatar', e.target.value)}
          optional
        />

        <div>
          <p className="mb-2 text-sm font-medium">社交链接</p>
          <div className="space-y-2">
            {socials.map((social, index) => (
              <div key={social.id} className="flex items-center gap-2">
                <input
                  value={social.label}
                  onChange={(e) => updateSocial(index, { label: e.target.value })}
                  placeholder="名称（如 GitHub）"
                  aria-label={`社交名称 ${index + 1}`}
                  className={`${inputClass} border-line`}
                />
                <input
                  value={social.url}
                  onChange={(e) => updateSocial(index, { url: e.target.value })}
                  placeholder="链接"
                  aria-label={`社交链接 ${index + 1}`}
                  className={`${inputClass} border-line`}
                />
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  aria-label="删除该社交链接"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-danger"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSocial}
            className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            <Plus size={14} aria-hidden="true" />
            添加社交链接
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <TextInput
            id="profile-yoe"
            label="工作年限"
            inputMode="numeric"
            value={form.yearsOfExperience}
            onChange={(e) => setField('yearsOfExperience', e.target.value)}
            error={errors.yearsOfExperience}
            optional
          />
          <TextInput
            id="profile-pc"
            label="项目数"
            inputMode="numeric"
            value={form.projectsCount}
            onChange={(e) => setField('projectsCount', e.target.value)}
            error={errors.projectsCount}
            optional
          />
          <TextInput
            id="profile-ps"
            label="博客数"
            inputMode="numeric"
            value={form.postsCount}
            onChange={(e) => setField('postsCount', e.target.value)}
            error={errors.postsCount}
            optional
          />
        </div>

        {saveMsg && (
          <p className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink" role="status">
            {saveMsg}
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
