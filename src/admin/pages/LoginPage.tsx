import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, toFieldErrors } from '../schemas'
import { btnPrimary, TextInput } from '../components/fields'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const parsed = loginSchema.safeParse({ username, password })
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await login(parsed.data)
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '登录失败，请重试。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold">后台登录</h1>
        <p className="mb-6 text-sm text-ink-secondary">请输入账号密码以进入内容管理后台</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextInput
            id="admin-username"
            label="账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            autoComplete="username"
          />
          <TextInput
            id="admin-password"
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          {formError && (
            <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
              {formError}
            </p>
          )}

          <button type="submit" disabled={submitting} className={`${btnPrimary} w-full justify-center`}>
            <LogIn size={16} aria-hidden="true" />
            {submitting ? '登录中…' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
