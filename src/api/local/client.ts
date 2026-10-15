import type { ApiClient, BlogPost, Profile, Project, SiteMeta, Skill } from '../types'
import { seedData } from './seed'
import { KEYS, readJson, writeJson } from './storage'

const DELAY_MS = 120

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS))
}

function ensureSeeded(): void {
  const meta = readJson<SiteMeta>(KEYS.meta)
  if (meta) return
  writeJson(KEYS.profile, seedData.profile)
  writeJson(KEYS.skills, seedData.skills)
  writeJson(KEYS.projects, seedData.projects)
  writeJson(KEYS.posts, seedData.posts)
  writeJson(KEYS.meta, { version: 1, updatedAt: new Date().toISOString() })
}

export const localClient: ApiClient = {
  async getProfile(): Promise<Profile> {
    await delay()
    ensureSeeded()
    return readJson<Profile>(KEYS.profile) ?? seedData.profile
  },

  async getSkills(): Promise<Skill[]> {
    await delay()
    ensureSeeded()
    return readJson<Skill[]>(KEYS.skills) ?? seedData.skills
  },

  async getProjects(): Promise<Project[]> {
    await delay()
    ensureSeeded()
    return readJson<Project[]>(KEYS.projects) ?? seedData.projects
  },

  async getProject(slug: string): Promise<Project | null> {
    await delay()
    ensureSeeded()
    const projects = readJson<Project[]>(KEYS.projects) ?? seedData.projects
    return projects.find((p) => p.slug === slug) ?? null
  },

  async getPosts(): Promise<BlogPost[]> {
    await delay()
    ensureSeeded()
    return readJson<BlogPost[]>(KEYS.posts) ?? seedData.posts
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    await delay()
    ensureSeeded()
    const posts = readJson<BlogPost[]>(KEYS.posts) ?? seedData.posts
    return posts.find((p) => p.slug === slug) ?? null
  },
}
