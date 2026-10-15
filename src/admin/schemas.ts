import { z } from 'zod'

/** 将 zod 错误压平成 { 字段: 首条错误 } 的字典，供表单回显。 */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.')
    if (!key) continue
    if (!out[key]) out[key] = issue.message
  }
  return out
}

const intString = z.string().regex(/^\d*$/, '请输入非负整数')

export const loginSchema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().min(1, '请输入密码'),
})

export const profileFormSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  tagline: z.string().min(1, '请输入一句话定位'),
  roles: z.string().min(1, '请输入角色，用逗号分隔'),
  summary: z.string().min(1, '请输入个人简介'),
  location: z.string(),
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  avatar: z.string(),
  yearsOfExperience: intString,
  projectsCount: intString,
  postsCount: intString,
})

export const skillFormSchema = z.object({
  name: z.string().min(1, '请输入技能名'),
  category: z.string().min(1, '请输入分类'),
  level: z.enum(['familiar', 'skilled', 'expert']),
  icon: z.string(),
  relatedProjectIds: z.string(),
})

export const projectFormSchema = z.object({
  title: z.string().min(1, '请输入项目标题'),
  slug: z.string().min(1, '请输入项目标识'),
  summary: z.string().min(1, '请输入项目简介'),
  cover: z.string(),
  techTags: z.string().min(1, '请输入技术标签，用逗号分隔'),
  live: z.string(),
  source: z.string(),
  featured: z.boolean(),
  order: intString,
  createdAt: z.string().min(1, '请输入日期'),
  background: z.string(),
  goals: z.string(),
  responsibilities: z.string(),
  outcomes: z.string(),
})

export const postFormSchema = z.object({
  title: z.string().min(1, '请输入文章标题'),
  slug: z.string().min(1, '请输入文章标识'),
  excerpt: z.string().min(1, '请输入摘要'),
  tags: z.string(),
  cover: z.string(),
  publishedAt: z.string().min(1, '请输入发布日期'),
  readingMinutes: intString,
  draft: z.boolean(),
  content: z.string().min(1, '请输入正文内容'),
})

export const settingsSchema = z.object({
  siteTitle: z.string().min(1, '请输入站点标题'),
  siteDescription: z.string(),
})

/** 按逗号（中英文）拆分标签/角色/关联项目 ID。 */
export function splitTags(value: string): string[] {
  return value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 按行拆分段落/列表项，用于 summary、goals 等字段。 */
export function splitLines(value: string): string[] {
  return value
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseIntOrUndefined(value: string): number | undefined {
  if (value === '') return undefined
  return Number(value)
}
