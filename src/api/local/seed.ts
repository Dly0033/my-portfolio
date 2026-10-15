import type { BlogPost, Profile, Project, Settings, Skill } from '../types'

export const seedProfile: Profile = {
  name: '你的名字',
  tagline: '你好，我是一名专注于构建高质量 Web 应用的前端 / 全栈开发者。',
  roles: ['前端工程师', '全栈开发者'],
  summary: [
    '这里是一段关于我的个人简介，介绍你的背景、经历与专长。',
    '可以在此补充你的兴趣、技术热情与当前关注方向。',
  ],
  location: '中国 · 远程',
  email: 'hello@example.com',
  socials: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/' },
    { id: 'email', label: 'Email', url: 'mailto:hello@example.com' },
  ],
  stats: {
    yearsOfExperience: 3,
    projectsCount: 8,
    postsCount: 5,
  },
}

export const seedSkills: Skill[] = [
  { id: 'react', name: 'React', category: '前端', level: 'expert', relatedProjectIds: ['p1', 'p2'] },
  { id: 'ts', name: 'TypeScript', category: '前端', level: 'expert', relatedProjectIds: ['p1'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: '前端', level: 'skilled', relatedProjectIds: ['p1', 'p2'] },
  { id: 'node', name: 'Node.js', category: '后端', level: 'skilled', relatedProjectIds: ['p3'] },
  { id: 'postgres', name: 'PostgreSQL', category: '后端', level: 'familiar', relatedProjectIds: ['p3'] },
  { id: 'git', name: 'Git', category: '工具', level: 'skilled', relatedProjectIds: [] },
  { id: 'docker', name: 'Docker', category: '工具', level: 'familiar', relatedProjectIds: [] },
]

export const seedProjects: Project[] = [
  {
    id: 'p1',
    slug: 'personal-portfolio',
    title: '个人展示网站',
    summary: '一个深色星空主题的个人作品集网站。',
    techTags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    links: { live: 'https://example.com', source: 'https://github.com/' },
    featured: true,
    detail: {
      background: '需要一个展示个人技能与项目的空间。',
      goals: ['搭建多端适配的个人网站', '沉淀博客内容'],
      responsibilities: ['整体架构与前端实现', '星空背景与动效'],
      outcomes: ['Lighthouse 性能 90+', '移动端体验良好'],
    },
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'p2',
    slug: 'task-app',
    title: '任务管理应用',
    summary: '一个轻量的任务看板工具。',
    techTags: ['React', 'TypeScript'],
    links: { source: 'https://github.com/' },
    featured: false,
    detail: {
      background: '需要一个支持拖拽与标签分类的个人任务管理工具。',
      goals: ['实现看板视图与拖拽排序', '本地持久化任务数据'],
      responsibilities: ['组件设计与状态管理', '拖拽交互实现'],
      outcomes: ['零依赖本地运行', '数据离线可用'],
    },
    order: 2,
    createdAt: '2025-10-01T00:00:00.000Z',
  },
  {
    id: 'p3',
    slug: 'blog-engine',
    title: '博客引擎',
    summary: '基于 Markdown 的静态博客系统。',
    techTags: ['Node.js', 'PostgreSQL', 'Markdown'],
    links: { source: 'https://github.com/' },
    featured: false,
    detail: {
      background: '需要一个支持 Markdown 写作与自动发布的博客系统。',
      goals: ['Markdown 解析与代码高亮', '静态页面生成与发布'],
      responsibilities: ['后端解析服务', '部署流程自动化'],
      outcomes: ['发布耗时降低 60%', '支持千级文章'],
    },
    order: 3,
    createdAt: '2025-06-01T00:00:00.000Z',
  },
]

export const seedPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'hello-world',
    title: '欢迎来到我的博客',
    excerpt: '第一篇博文，介绍一下这个站点和我。',
    content:
      '# 欢迎\n\n这是**第一篇**博文。\n\n- 项目列表\n- 代码示例\n\n```ts\nconsole.log("hello")\n```\n',
    tags: ['随笔'],
    publishedAt: '2026-01-10T00:00:00.000Z',
    readingMinutes: 2,
  },
  {
    id: 'b2',
    slug: 'build-portfolio',
    title: '如何搭建一个个人作品集网站',
    excerpt: '从技术选型到星空背景的实现思路。',
    content: '# 搭建个人作品集\n\n介绍 React + Vite + Tailwind 的搭建过程。\n',
    tags: ['前端', '教程'],
    publishedAt: '2026-02-15T00:00:00.000Z',
    readingMinutes: 5,
  },
]

export const seedSettings: Settings = {
  siteTitle: 'My Portfolio',
  siteDescription: '个人展示网站',
}

export const seedData = {
  profile: seedProfile,
  skills: seedSkills,
  projects: seedProjects,
  posts: seedPosts,
  settings: seedSettings,
}
