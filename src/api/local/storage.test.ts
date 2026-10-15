import { beforeEach, describe, expect, it } from 'vitest'
import { clearAll, KEYS, readJson, writeJson } from './storage'

describe('storage', () => {
  beforeEach(() => {
    clearAll()
  })

  it('round-trips a JSON object', () => {
    writeJson(KEYS.profile, { name: 'Alice' })
    expect(readJson<{ name: string }>(KEYS.profile)).toEqual({ name: 'Alice' })
  })

  it('returns null when the key is missing', () => {
    expect(readJson(KEYS.profile)).toBeNull()
  })

  it('removes a key after clearAll', () => {
    writeJson(KEYS.profile, { name: 'Alice' })
    clearAll()
    expect(readJson(KEYS.profile)).toBeNull()
  })
})
