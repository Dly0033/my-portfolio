import type {
  ApiClient,
  AuthSession,
  BlogPost,
  ContactMessage,
  LoginCredentials,
  Profile,
  Project,
  Settings,
  SiteMeta,
  Skill,
} from '../types'
import { login as authLogin, logout as authLogout } from '../auth'
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
  writeJson(KEYS.settings, seedData.settings)
  writeJson(KEYS.meta, { version: 1, updatedAt: new Date().toISOString() })
}

function readList<T>(key: string, fallback: T[]): T[] {
  return readJson<T[]>(key) ?? fallback
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
    return readList<Skill>(KEYS.skills, seedData.skills)
  },

  async getProjects(): Promise<Project[]> {
    await delay()
    ensureSeeded()
    return readList<Project>(KEYS.projects, seedData.projects)
  },

  async getProject(slug: string): Promise<Project | null> {
    await delay()
    ensureSeeded()
    const projects = readList<Project>(KEYS.projects, seedData.projects)
    return projects.find((p) => p.slug === slug) ?? null
  },

  async getPosts(): Promise<BlogPost[]> {
    await delay()
    ensureSeeded()
    return readList<BlogPost>(KEYS.posts, seedData.posts)
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    await delay()
    ensureSeeded()
    const posts = readList<BlogPost>(KEYS.posts, seedData.posts)
    return posts.find((p) => p.slug === slug) ?? null
  },

  async sendContactMessage(message: ContactMessage): Promise<void> {
    await delay()
    ensureSeeded()
    const existing = readList<ContactMessage>(KEYS.messages, [])
    writeJson(KEYS.messages, [...existing, message])
  },

  async getSettings(): Promise<Settings> {
    await delay()
    ensureSeeded()
    return readJson<Settings>(KEYS.settings) ?? seedData.settings
  },

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay()
    return authLogin(credentials)
  },

  async logout(): Promise<void> {
    await delay()
    authLogout()
  },

  async getMessages(): Promise<ContactMessage[]> {
    await delay()
    ensureSeeded()
    return readList<ContactMessage>(KEYS.messages, [])
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    await delay()
    ensureSeeded()
    writeJson(KEYS.profile, profile)
    return profile
  },

  async updateSettings(settings: Settings): Promise<Settings> {
    await delay()
    ensureSeeded()
    writeJson(KEYS.settings, settings)
    return settings
  },

  async createSkill(skill: Skill): Promise<Skill> {
    await delay()
    ensureSeeded()
    const list = readList<Skill>(KEYS.skills, seedData.skills)
    writeJson(KEYS.skills, [...list, skill])
    return skill
  },

  async updateSkill(id: string, skill: Skill): Promise<Skill> {
    await delay()
    ensureSeeded()
    const list = readList<Skill>(KEYS.skills, seedData.skills)
    writeJson(
      KEYS.skills,
      list.map((item) => (item.id === id ? { ...skill, id } : item)),
    )
    return skill
  },

  async deleteSkill(id: string): Promise<void> {
    await delay()
    ensureSeeded()
    const list = readList<Skill>(KEYS.skills, seedData.skills)
    writeJson(
      KEYS.skills,
      list.filter((item) => item.id !== id),
    )
  },

  async createProject(project: Project): Promise<Project> {
    await delay()
    ensureSeeded()
    const list = readList<Project>(KEYS.projects, seedData.projects)
    writeJson(KEYS.projects, [...list, project])
    return project
  },

  async updateProject(id: string, project: Project): Promise<Project> {
    await delay()
    ensureSeeded()
    const list = readList<Project>(KEYS.projects, seedData.projects)
    writeJson(
      KEYS.projects,
      list.map((item) => (item.id === id ? { ...project, id } : item)),
    )
    return project
  },

  async deleteProject(id: string): Promise<void> {
    await delay()
    ensureSeeded()
    const list = readList<Project>(KEYS.projects, seedData.projects)
    writeJson(
      KEYS.projects,
      list.filter((item) => item.id !== id),
    )
  },

  async createPost(post: BlogPost): Promise<BlogPost> {
    await delay()
    ensureSeeded()
    const list = readList<BlogPost>(KEYS.posts, seedData.posts)
    writeJson(KEYS.posts, [...list, post])
    return post
  },

  async updatePost(id: string, post: BlogPost): Promise<BlogPost> {
    await delay()
    ensureSeeded()
    const list = readList<BlogPost>(KEYS.posts, seedData.posts)
    writeJson(
      KEYS.posts,
      list.map((item) => (item.id === id ? { ...post, id } : item)),
    )
    return post
  },

  async deletePost(id: string): Promise<void> {
    await delay()
    ensureSeeded()
    const list = readList<BlogPost>(KEYS.posts, seedData.posts)
    writeJson(
      KEYS.posts,
      list.filter((item) => item.id !== id),
    )
  },
}
