import type { ApiClient, BlogPost, Profile, Project, Skill } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`请求失败：${res.status}`)
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
}
