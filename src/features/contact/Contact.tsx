import { useState } from 'react'
import type { FormEvent } from 'react'
import { Send } from 'lucide-react'
import { api } from '@/api'
import { Section } from '@/components/Section'
import type { ContactFormFields, FieldErrors } from '@/lib/validation'
import { validateContactForm } from '@/lib/validation'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const initialFields: ContactFormFields = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-ink-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm text-danger">
      {message}
    </p>
  )
}

export function Contact() {
  const [fields, setFields] = useState<ContactFormFields>(initialFields)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState('')

  function updateField(key: keyof ContactFormFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateContactForm(fields)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setSubmitError('')
    try {
      await api.sendContactMessage({
        name: fields.name.trim(),
        email: fields.email.trim(),
        subject: fields.subject.trim() || undefined,
        message: fields.message.trim(),
      })
      setStatus('success')
      setFields(initialFields)
    } catch (err) {
      setStatus('error')
      setSubmitError(err instanceof Error ? err.message : '发送失败，请稍后重试。')
    }
  }

  return (
    <Section id="contact" title="联系我" subtitle="有问题或合作意向？欢迎给我留言">
      <form className="max-w-2xl space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
            姓名
          </label>
          <input
            id="contact-name"
            type="text"
            value={fields.name}
            onChange={(e) => updateField('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            autoComplete="name"
            className={inputClass}
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
            邮箱
          </label>
          <input
            id="contact-email"
            type="email"
            value={fields.email}
            onChange={(e) => updateField('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            autoComplete="email"
            className={inputClass}
          />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium">
            主题（可选）
          </label>
          <input
            id="contact-subject"
            type="text"
            value={fields.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            className={inputClass}
          />
          <FieldError id="contact-subject-error" message={errors.subject} />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
            消息
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={fields.message}
            onChange={(e) => updateField('message', e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={inputClass}
          />
          <FieldError id="contact-message-error" message={errors.message} />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} aria-hidden="true" />
          {status === 'submitting' ? '发送中…' : '发送消息'}
        </button>

        {status === 'success' && (
          <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink" role="status">
            消息已发送，感谢你的联系！
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            {submitError}
          </p>
        )}
      </form>
    </Section>
  )
}
