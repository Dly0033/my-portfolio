export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

class MemoryStorage implements StorageLike {
  private map = new Map<string, string>()

  getItem(key: string): string | null {
    return this.map.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value)
  }

  removeItem(key: string): void {
    this.map.delete(key)
  }

  clear(): void {
    this.map.clear()
  }
}

const memory = new MemoryStorage()

function resolveStore(): StorageLike {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage as unknown as StorageLike
    }
  } catch {
    // localStorage 在某些环境访问会抛错，回退到内存
  }
  return memory
}

const PREFIX = 'pf.'

export const KEYS = {
  profile: `${PREFIX}profile`,
  skills: `${PREFIX}skills`,
  projects: `${PREFIX}projects`,
  posts: `${PREFIX}posts`,
  meta: `${PREFIX}meta`,
  messages: `${PREFIX}messages`,
  settings: `${PREFIX}settings`,
  auth: `${PREFIX}auth`,
} as const

export function readJson<T>(key: string): T | null {
  try {
    const raw = resolveStore().getItem(key)
    if (raw == null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeJson<T>(key: string, value: T): void {
  resolveStore().setItem(key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  resolveStore().removeItem(key)
}

export function clearAll(): void {
  const store = resolveStore()
  for (const key of Object.values(KEYS)) {
    store.removeItem(key)
  }
  memory.clear()
}
