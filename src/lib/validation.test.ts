import { describe, expect, it } from 'vitest'
import type { ContactFormFields } from './validation'
import { validateContactForm } from './validation'

const valid: ContactFormFields = {
  name: '张三',
  email: 'zhangsan@example.com',
  subject: '合作咨询',
  message: '你好，我想了解一下你的项目。',
}

describe('validateContactForm', () => {
  it('returns no errors for a valid form', () => {
    expect(validateContactForm(valid)).toEqual({})
  })

  it('requires a name', () => {
    expect(validateContactForm({ ...valid, name: '   ' }).name).toBeTruthy()
  })

  it('rejects a name longer than 40 characters', () => {
    expect(validateContactForm({ ...valid, name: 'a'.repeat(41) }).name).toBeTruthy()
  })

  it('accepts a name of exactly 40 characters', () => {
    expect(validateContactForm({ ...valid, name: 'a'.repeat(40) }).name).toBeUndefined()
  })

  it('requires an email', () => {
    expect(validateContactForm({ ...valid, email: '  ' }).email).toBeTruthy()
  })

  it('rejects an invalid email', () => {
    expect(validateContactForm({ ...valid, email: 'not-an-email' }).email).toBeTruthy()
  })

  it('accepts a valid email', () => {
    expect(validateContactForm({ ...valid, email: 'a.b@example.co' }).email).toBeUndefined()
  })

  it('allows an empty subject', () => {
    expect(validateContactForm({ ...valid, subject: '   ' }).subject).toBeUndefined()
  })

  it('rejects a subject longer than 100 characters', () => {
    expect(validateContactForm({ ...valid, subject: 'a'.repeat(101) }).subject).toBeTruthy()
  })

  it('requires a message', () => {
    expect(validateContactForm({ ...valid, message: '   ' }).message).toBeTruthy()
  })
})
