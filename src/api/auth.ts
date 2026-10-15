import type { AuthSession, LoginCredentials } from './types'
import { KEYS, readJson, removeItem, writeJson } from './local/storage'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 // 24 小时

/**
 * 默认后台账号（演示用）。
 * 仅在前端本地比对，接入真实后端后应由服务端校验并下发 token。
 */
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
} as const

function generateToken(): string {
  const rand = () => Math.random().toString(36).slice(2)
  return `${Date.now().toString(36)}-${rand()}-${rand()}`
}

/** 同步读取当前会话（用于路由守卫），过期则清除。 */
export function getSession(): AuthSession | null {
  const session = readJson<AuthSession>(KEYS.auth)
  if (!session) return null
  if (Date.now() > new Date(session.expiresAt).getTime()) {
    removeItem(KEYS.auth)
    return null
  }
  return session
}

/** 校验账号密码并写入会话，密码不落盘，仅存 token。 */
export function login(credentials: LoginCredentials): AuthSession {
  if (
    credentials.username !== DEFAULT_ADMIN.username ||
    credentials.password !== DEFAULT_ADMIN.password
  ) {
    throw new Error('账号或密码错误')
  }
  const session: AuthSession = {
    token: generateToken(),
    username: DEFAULT_ADMIN.username,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  }
  writeJson(KEYS.auth, session)
  return session
}

/** 清除会话。 */
export function logout(): void {
  removeItem(KEYS.auth)
}
