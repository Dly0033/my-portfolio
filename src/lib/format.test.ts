import { describe, expect, it } from 'vitest'
import { formatDate, groupBy, slugify } from './format'

describe('formatDate', () => {
  it('formats a valid ISO date with year', () => {
    const result = formatDate('2026-01-15T00:00:00.000Z')
    expect(result).toContain('2026')
  })

  it('returns the input for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})

describe('slugify', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('preserves chinese characters', () => {
    expect(slugify('我的项目')).toBe('我的项目')
  })
})

describe('groupBy', () => {
  it('groups items by key', () => {
    const items = [
      { name: 'a', type: 'x' },
      { name: 'b', type: 'y' },
      { name: 'c', type: 'x' },
    ]
    const result = groupBy(items, (i) => i.type)
    expect(result.x).toHaveLength(2)
    expect(result.y).toHaveLength(1)
  })
})
