import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Save } from 'lucide-react'
import { api } from '@/api'
import { ErrorNotice, Loading } from '@/components/Status'
import { useResource } from '../hooks/useResource'
import { settingsSchema, toFieldErrors } from '../schemas'
import { btnPrimary, TextArea, TextInput } from '../components/fields'
import { PageHeader } from '../components/PageHeader'

export function SettingsPage() {
  const { status, data, error, reload } = useResource(() => api.getSettings(), [])
  const [siteTitle, setSiteTitle] = useState('')
  const [siteDescription, setSiteDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (status === 'success' && data) {
      setSiteTitle(data.siteTitle)
      setSiteDescription(data.siteDescription)
    }
  }, [status, data])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />
  if (!data) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveMsg('')

    const parsed = settingsSchema.safeParse({ siteTitle, siteDescription })
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setSaving(true)
    try {
      await api.updateSettings({ siteTitle: siteTitle.trim(), siteDescription: siteDescription.trim() })
      setSaveMsg('已保存。')
      reload()
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : '保存失败，请重试。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="站点设置" subtitle="维护站点基础信息（标题用于前台导航）" />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5" noValidate>
        <TextInput
          id="settings-title"
          label="站点标题"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          error={errors.siteTitle}
        />
        <TextArea
          id="settings-description"
          label="站点描述"
          rows={3}
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          error={errors.siteDescription}
        />

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
