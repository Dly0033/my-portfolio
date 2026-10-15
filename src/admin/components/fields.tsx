import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export const inputClass =
  'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

export const btnPrimary =
  'inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60'

export const btnSecondary =
  'inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent'

export const btnDanger =
  'inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'

function borderClass(hasError: boolean) {
  return hasError ? 'border-danger' : 'border-line'
}

export function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-ink-secondary">（可选）</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  optional?: boolean
}

export function TextInput({ id, label, error, optional, className, ...rest }: TextInputProps) {
  return (
    <Field label={label} htmlFor={id} error={error} optional={optional}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${borderClass(Boolean(error))} ${className ?? ''}`}
        {...rest}
      />
    </Field>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
  optional?: boolean
}

export function TextArea({ id, label, error, optional, className, ...rest }: TextAreaProps) {
  return (
    <Field label={label} htmlFor={id} error={error} optional={optional}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${borderClass(Boolean(error))} ${className ?? ''}`}
        {...rest}
      />
    </Field>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}

export function Select({ id, label, error, optional, className, children, ...rest }: SelectProps) {
  return (
    <Field label={label} htmlFor={id} error={error} optional={optional}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={`${inputClass} ${borderClass(Boolean(error))} ${className ?? ''}`}
        {...rest}
      >
        {children}
      </select>
    </Field>
  )
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

export function Checkbox({ id, label, ...rest }: CheckboxProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
        {...rest}
      />
      {label}
    </label>
  )
}
