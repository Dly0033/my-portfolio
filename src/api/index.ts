import type { ApiClient } from './types'
import { httpClient } from './http/client'
import { localClient } from './local/client'

const source: string = import.meta.env.VITE_DATA_SOURCE ?? 'local'

export const api: ApiClient = source === 'http' ? httpClient : localClient

export * from './types'
export * from './auth'
