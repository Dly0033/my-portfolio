/** 技能熟练度：三档，避免百分比误导（PRD §2.2） */
export type SkillLevel = 'familiar' | 'skilled' | 'expert'

/** 社交/联系链接 */
export interface SocialLink {
  id: string
  label: string
  url: string
}

/** 个人资料 */
export interface Profile {
  name: string
  tagline: string
  roles: string[]
  summary: string[]
  location?: string
  email: string
  avatar?: string
  socials: SocialLink[]
  stats: {
    yearsOfExperience?: number
    projectsCount?: number
    postsCount?: number
  }
}

/** 技能 */
export interface Skill {
  id: string
  name: string
  category: string
  level: SkillLevel
  icon?: string
  relatedProjectIds: string[]
}

/** 项目 */
export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  cover?: string
  techTags: string[]
  links: {
    live?: string
    source?: string
  }
  featured: boolean
  detail?: {
    background?: string
    goals?: string[]
    responsibilities?: string[]
    outcomes?: string[]
  }
  order: number
  createdAt: string
}

/** 博客文章 */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  publishedAt: string
  readingMinutes: number
  cover?: string
  draft?: boolean
}

/** 站点元信息（用于数据 schema 版本迁移） */
export interface SiteMeta {
  version: number
  updatedAt: string
}

/** 数据接口契约：local / http 两种实现共用 */
export interface ApiClient {
  getProfile(): Promise<Profile>
  getSkills(): Promise<Skill[]>
  getProjects(): Promise<Project[]>
  getProject(slug: string): Promise<Project | null>
  getPosts(): Promise<BlogPost[]>
  getPost(slug: string): Promise<BlogPost | null>
}
