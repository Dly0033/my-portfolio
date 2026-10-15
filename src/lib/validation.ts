export interface ContactFormFields {
  name: string
  email: string
  subject: string
  message: string
}

export type FieldErrors = Partial<Record<keyof ContactFormFields, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(fields: ContactFormFields): FieldErrors {
  const errors: FieldErrors = {}

  const name = fields.name.trim()
  if (!name) {
    errors.name = '请填写姓名'
  } else if (name.length > 40) {
    errors.name = '姓名不能超过 40 个字符'
  }

  const email = fields.email.trim()
  if (!email) {
    errors.email = '请填写邮箱'
  } else if (!EMAIL_RE.test(email)) {
    errors.email = '邮箱格式不正确'
  }

  if (fields.subject.trim().length > 100) {
    errors.subject = '主题不能超过 100 个字符'
  }

  if (!fields.message.trim()) {
    errors.message = '请填写消息内容'
  }

  return errors
}
