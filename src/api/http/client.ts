import type {
  ApiClient,
  AuthSession,
  BlogPost,
  ContactMessage,
  LoginCredentials,
  Profile,
  Project,
  Settings,
  Skill,
} from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init)
  if (!res.ok) {
    throw new Error(`请求失败：${res.status}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

// 预留实现：接入真实后端时启用（VITE_DATA_SOURCE=http）
export const httpClient: ApiClient = {
  getProfile: () => request<Profile>('/profile'),
  getSkills: () => request<Skill[]>('/skills'),
  getProjects: () => request<Project[]>('/projects'),
  getProject: (slug: string) => request<Project | null>(`/projects/${slug}`),
  getPosts: () => request<BlogPost[]>('/posts'),
  getPost: (slug: string) => request<BlogPost | null>(`/posts/${slug}`),
  sendContactMessage: (message: ContactMessage) =>
    request<void>('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    }),
  getSettings: () => request<Settings>('/settings'),

  login: (credentials: LoginCredentials) =>
    request<AuthSession>('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),
  logout: () => request<void>('/admin/logout', { method: 'POST' }),

  getMessages: () => request<ContactMessage[]>('/admin/messages'),
  updateProfile: (profile: Profile) =>
    request<Profile>('/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }),
  updateSettings: (settings: Settings) =>
    request<Settings>('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }),

  createSkill: (skill: Skill) =>
    request<Skill>('/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    }),
  updateSkill: (id: string, skill: Skill) =>
    request<Skill>(`/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill),
    }),
  deleteSkill: (id: string) => request<void>(`/skills/${id}`, { method: 'DELETE' }),

  createProject: (project: Project) =>
    request<Project>('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    }),
  updateProject: (id: string, project: Project) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    }),
  deleteProject: (id: string) => request<void>(`/projects/${id}`, { method: 'DELETE' }),

  createPost: (post: BlogPost) =>
    request<BlogPost>('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    }),
  updatePost: (id: string, post: BlogPost) =>
    request<BlogPost>(`/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    }),
  deletePost: (id: string) => request<void>(`/posts/${id}`, { method: 'DELETE' }),
}
