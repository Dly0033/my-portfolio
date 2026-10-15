import { useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '@/api'
import type { Skill, SkillLevel } from '@/api'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { useResource } from '../hooks/useResource'
import { skillFormSchema, splitTags, toFieldErrors } from '../schemas'
import { btnPrimary, btnSecondary, Select, TextInput } from '../components/fields'
import { PageHeader } from '../components/PageHeader'
import { ConfirmDialog } from '../components/ConfirmDialog'

const levelLabel: Record<SkillLevel, string> = {
  familiar: '熟悉',
  skilled: '熟练',
  expert: '精通',
}

interface SkillForm {
  name: string
  category: string
  level: SkillLevel
  icon: string
  relatedProjectIds: string
}

const emptySkill: SkillForm = {
  name: '',
  category: '',
  level: 'familiar',
  icon: '',
  relatedProjectIds: '',
}

export function SkillsPage() {
  const { status, data, error, reload } = useResource(() => api.getSkills(), [])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState<SkillForm>(emptySkill)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState(false)

  function openCreate() {
    setForm(emptySkill)
    setEditing(null)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(skill: Skill) {
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon ?? '',
      relatedProjectIds: skill.relatedProjectIds.join(', '),
    })
    setEditing(skill)
    setErrors({})
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = skillFormSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }

    setSaving(true)
    try {
      const skill: Skill = {
        id: editing?.id ?? `skill-${Date.now()}`,
        name: form.name.trim(),
        category: form.category.trim(),
        level: form.level,
        icon: form.icon.trim() || undefined,
        relatedProjectIds: splitTags(form.relatedProjectIds),
      }
      if (editing) await api.updateSkill(editing.id, skill)
      else await api.createSkill(skill)
      closeForm()
      reload()
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : '保存失败，请重试。' })
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await api.deleteSkill(pendingDelete.id)
      setPendingDelete(null)
      reload()
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />

  const skills = data ?? []

  return (
    <div>
      <PageHeader
        title="技能"
        subtitle="管理技术栈与熟练程度"
        actions={
          <button type="button" onClick={openCreate} className={btnPrimary}>
            <Plus size={16} aria-hidden="true" />
            新增技能
          </button>
        }
      />

      {skills.length === 0 && <EmptyNotice message="暂无技能，点击右上角新增。" />}

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between rounded-xl border border-line/60 bg-surface p-4"
          >
            <div>
              <p className="font-medium">{skill.name}</p>
              <p className="text-sm text-ink-secondary">
                {skill.category} · {levelLabel[skill.level] ?? skill.level}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(skill)}
                aria-label={`编辑 ${skill.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-ink"
              >
                <Pencil size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(skill)}
                aria-label={`删除 ${skill.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-danger"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6">
            <h3 className="mb-4 text-lg font-semibold">{editing ? '编辑技能' : '新增技能'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <TextInput
                id="skill-name"
                label="技能名"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                error={errors.name}
              />
              <TextInput
                id="skill-category"
                label="分类"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                error={errors.category}
              />
              <Select
                id="skill-level"
                label="熟练度"
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as SkillLevel }))}
              >
                <option value="familiar">熟悉</option>
                <option value="skilled">熟练</option>
                <option value="expert">精通</option>
              </Select>
              <TextInput
                id="skill-icon"
                label="图标名"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                optional
              />
              <TextInput
                id="skill-related"
                label="关联项目 ID（逗号分隔）"
                value={form.relatedProjectIds}
                onChange={(e) => setForm((f) => ({ ...f, relatedProjectIds: e.target.value }))}
                optional
              />

              {errors.form && <p className="text-sm text-danger">{errors.form}</p>}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeForm} className={btnSecondary}>
                  取消
                </button>
                <button type="submit" disabled={saving} className={btnPrimary}>
                  {saving ? '保存中…' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="删除技能"
        message={`确定删除「${pendingDelete?.name ?? ''}」吗？此操作不可撤销。`}
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
