# 个人展示网站 · 技术设计文档（TECH_DESIGN）

| 项目 | 内容 |
| --- | --- |
| 文档名称 | 技术设计文档（TECH_DESIGN） |
| 版本 | v1.0 |
| 日期 | 2026-10-15 |
| 关联文档 | `PRD.md` |
| 状态 | 草案 |

---

## 1. 技术栈选择

### 1.1 总体说明

当前阶段以**纯前端 + 浏览器本地存储（localStorage）模拟后端**，数据访问全部收敛到 `src/api/` 接口层。这样页面组件只依赖稳定接口，不感知数据来源；将来接入真实后端时，只需替换 `src/api/` 内的实现，业务代码零改动。

### 1.2 前端

| 类别 | 选型 | 理由 |
| --- | --- | --- |
| 语言 | TypeScript | 类型安全，配合数据模型（§3）落地 |
| 框架 | React 18+ | 生态成熟、组件化、Hooks 适合交互型单页 |
| 构建 | Vite | 启动/热更新快，天然支持 TS，配置简单 |
| 样式 | Tailwind CSS | 原子化、响应式方便、与设计 token 易映射 |
| 路由 | React Router v6 | 单页 + 博客子路由（`/blog`、`/blog/:slug`） |
| 状态/数据请求 | TanStack Query（可选） | 统一缓存/加载/错误态，替换后端后无缝对接 |
| 内容渲染 | react-markdown + rehype/remark 插件 | 博客 Markdown 渲染 |
| 代码高亮 | Shiki 或 highlight.js | 深色主题下的代码高亮 + 复制按钮 |
| 图标 | lucide-react（或 Phosphor） | 统一风格 SVG 图标（非 emoji） |
| 星空背景 | 自绘 Canvas 2D（自定义 Hook） | 轻量、可控、易做降级 |

### 1.3 后端（当前为模拟，未来目标）

| 阶段 | 方案 | 说明 |
| --- | --- | --- |
| **当前（MVP/V1）** | 无真实后端，`localStorage` 模拟 | 数据经 `src/api/` 统一读写，模拟异步延迟 |
| **未来（V2）** | Node.js（NestJS / Fastify）+ REST API | 与 `src/api/` 接口签名保持一致，替换实现即可 |

### 1.4 数据库（当前为模拟，未来目标）

| 阶段 | 方案 | 说明 |
| --- | --- | --- |
| **当前** | `localStorage`（按 key 分域存储 JSON） | 个人资料、技能、项目、博客均序列化为 JSON |
| **未来** | PostgreSQL 或 SQLite（内容型小站） | 博客用 SQLite/Postgres；文件类（封面图）走对象存储 |

### 1.5 开发辅助

- 包管理：pnpm（或 npm）
- 代码规范：ESLint + Prettier
- 提交规范：Conventional Commits（可选）
- 环境变量：`.env` 区分数据源（见 §2.3）

---

## 2. 项目结构

### 2.1 目录总览

```
my-portfolio/
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
├─ .env                       # VITE_DATA_SOURCE=local
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.tsx                # 入口，挂载 React + Router
   ├─ App.tsx                 # 布局壳：导航 + 星空 + 路由出口 + 页脚
   ├─ router.tsx              # 路由表
   ├─ styles/
   │  ├─ index.css            # Tailwind 指令 + 全局样式
   │  └─ tokens.css           # 设计 token（CSS 变量，对应 PRD §3.3）
   ├─ api/                    # ★ 数据接口层（唯一数据出入口）
   │  ├─ types.ts             # 所有领域类型的 TypeScript 定义（对应 §3）
   │  ├─ index.ts             # 统一出口，按环境选择实现
   │  ├─ local/
   │  │  ├─ storage.ts        # localStorage 读写封装（key 命名、JSON 序列化、默认种子数据）
   │  │  └─ client.ts         # LocalStorageClient：实现 ApiClient 接口（带模拟延迟）
   │  └─ http/
   │     └─ client.ts         # HttpClient：预留，对接真实后端（未来启用）
   ├─ components/             # 通用 UI 组件（按钮、卡片、标签、图标按钮等）
   ├─ features/               # 业务区块（按 PRD 模块拆分）
   │  ├─ hero/                # Hero + 关于我
   │  ├─ skills/              # 技能展示
   │  ├─ projects/            # 项目展示
   │  └─ blog/                # 博客列表 + 详情
   ├─ effects/
   │  └─ Starfield.tsx        # 星空背景组件（Canvas 2D）
   ├─ hooks/                  # useStarfield、usePrefersReducedMotion 等
   ├─ lib/                    # 工具函数（日期格式化、slug 等）
   └─ config/
      └─ site.ts              # 站点级静态配置（标题、导航项、社交链接）
```

### 2.2 分层原则

1. **表现层（components / features）**：只负责渲染与交互，通过 `src/api` 或 Hooks 获取数据，不直接触碰 `localStorage`。
2. **数据层（src/api）**：唯一的「后端」出入口，对外暴露稳定接口，内部可切换 local/http。
3. **领域类型（src/api/types.ts）**：全项目共享的数据契约，页面与数据层都依赖它。
4. **基础设施（styles / lib / config）**：设计 token、工具函数、静态配置。

> 关键约束：**除 `src/api/` 外，任何模块不得直接读写 `localStorage`**，确保将来无缝切换后端。

### 2.3 数据源切换机制

通过环境变量控制实现：

```
VITE_DATA_SOURCE=local    # 当前：localStorage 模拟
VITE_DATA_SOURCE=http     # 未来：真实后端
```

`src/api/index.ts` 据此导出 `localClient` 或 `httpClient`，二者实现同一 `ApiClient` 接口。页面始终 `import { api } from '@/api'`，不感知底层实现。

---

## 3. 数据模型

所有类型定义在 `src/api/types.ts`，数据以 JSON 序列化后存入 `localStorage`（key 前缀 `pf.`）。

### 3.1 存储键与命名空间

| Key | 内容 | 对应类型 |
| --- | --- | --- |
| `pf.profile` | 个人资料 | `Profile` |
| `pf.skills` | 技能列表 | `Skill[]` |
| `pf.projects` | 项目列表 | `Project[]` |
| `pf.posts` | 博客文章列表 | `BlogPost[]` |
| `pf.meta` | 站点元信息/版本 | `SiteMeta` |

### 3.2 类型定义

```ts
// ---------- 通用 ----------
/** 技能熟练度：三档，避免百分比误导（PRD §2.2） */
export type SkillLevel = 'familiar' | 'skilled' | 'expert';

/** 社交/联系链接 */
export interface SocialLink {
  id: string;          // 'github' | 'x' | 'email' | 'linkedin' | ...
  label: string;       // 可读名称
  url: string;
}

// ---------- 个人资料 ----------
export interface Profile {
  name: string;                 // 姓名/昵称
  tagline: string;              // 一句话定位（Hero 主文案）
  roles: string[];              // 角色/标签，如 ['前端工程师', '全栈开发者']
  summary: string[];            // 关于我，多段
  location?: string;
  email: string;
  avatar?: string;              // 头像 URL/路径，可为空
  socials: SocialLink[];
  stats: {                      // 关键数据点（可选）
    yearsOfExperience?: number;
    projectsCount?: number;
    postsCount?: number;
  };
}

// ---------- 技能 ----------
export interface Skill {
  id: string;
  name: string;                 // 技能名，如 'React'
  category: string;             // 分类：'前端' | '后端' | '工具' | ...
  level: SkillLevel;
  icon?: string;                // 图标名（映射到 SVG 图标集）
  relatedProjectIds: string[];  // 关联项目（技能 → 项目）
}

// ---------- 项目 ----------
export interface Project {
  id: string;
  slug: string;                 // 用于 URL / 锚点
  title: string;
  summary: string;              // 一句话简介
  cover?: string;               // 封面图 URL/路径
  techTags: string[];           // 技术标签
  links: {
    live?: string;              // 在线地址
    source?: string;            // 源码地址
  };
  featured: boolean;            // 是否精选（置顶）
  detail?: {                    // 详情（展开或详情页）
    background?: string;        // 背景
    goals?: string[];           // 目标
    responsibilities?: string[];// 我的职责
    outcomes?: string[];        // 成果/指标
  };
  order: number;                // 排序权重
  createdAt: string;            // ISO 日期
}

// ---------- 博客 ----------
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;              // 摘要
  content: string;              // Markdown 原文
  tags: string[];
  publishedAt: string;          // ISO 日期
  readingMinutes: number;       // 阅读时长
  cover?: string;
  draft?: boolean;              // 草稿标记
}

// ---------- 站点元信息 ----------
export interface SiteMeta {
  version: number;              // 数据 schema 版本，用于迁移
  updatedAt: string;
}
```

### 3.3 初始化与迁移

- 首次访问：`src/api/local/storage.ts` 检测无数据时，写入内置**种子数据**（示例个人资料、技能、项目、文章），保证站点开箱即用。
- 后续升级：依据 `pf.meta.version` 做数据迁移（如字段增删），避免旧数据崩溃。

---

## 4. 关键技术点

### 4.1 数据层抽象（最重要的架构约束）

**难点：** 让「模拟后端」与「真实后端」可无痛替换。

**方案：**

```ts
// src/api/index.ts（示意）
export interface ApiClient {
  getProfile(): Promise<Profile>;
  getSkills(): Promise<Skill[]>;
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  getPosts(): Promise<BlogPost[]>;
  getPost(slug: string): Promise<BlogPost | null>;
  // 后台管理（未来）：createProject / updateProject / deletePost ...
}

export const api: ApiClient =
  import.meta.env.VITE_DATA_SOURCE === 'http' ? httpClient : localClient;
```

**要点：**

- 接口签名稳定，`LocalStorageClient` 模拟 50–200ms 异步延迟，提前暴露加载态/错误态。
- 返回 `Promise`（异步契约），页面用 loading/error/empty 三态处理，避免「未来接后端时还要补状态处理」。
- 数据序列化统一走 `storage.ts`，出错时回退种子数据并降级提示。

### 4.2 星空背景的性能与降级

**难点：** Canvas 动画在移动端耗电/掉帧，且不能干扰阅读。

**方案：**

- 单实例 `<canvas>` 覆盖全屏，`z-index` 最低；用 `requestAnimationFrame` 驱动。
- 粒子数量按视口/设备降级：桌面 150–300，移动 ≤ 80；用 `devicePixelRatio` 限制绘制精度。
- `document.visibilityState === 'hidden'` 时暂停渲染循环。
- 读取 `prefers-reduced-motion`：为 `reduce` 时渲染一次静态星图，不再重绘。
- 鼠标/滚动视差通过 `transform` 作用于容器，避免触发重排。

### 4.3 博客 Markdown 渲染与安全

**难点：** Markdown 转 HTML 的 XSS 风险 + 深色主题代码高亮。

**方案：**

- 使用 `react-markdown`，**不启用** `rehype-raw`（禁止原始 HTML 注入）；必要时白名单过滤。
- 代码块：`react-syntax-highlighter` 或 Shiki，套用与设计 token 匹配的深色主题，并提供「复制」按钮。
- 目录（TOC）：解析标题生成锚点导航，配合滚动高亮。
- 文章内容较大时做懒加载 / 按需渲染。

### 4.4 响应式与触摸体验

**难点：** 320px–1920px 全覆盖、无横向滚动、触摸目标达标。

**方案：**

- Tailwind 响应式断点对齐 PRD §3.7（`sm/md/lg`）；mobile-first 书写。
- 交互元素最小 44×44px；图片 `max-width: 100%` + `aspect-ratio` 预留占位，防 CLS。
- 星空 Canvas 在移动端降低帧率（如 30fps），减少发热。

### 4.5 SEO 与首屏性能

**难点：** 单页应用（SPA）对 SEO 不友好，但博客需要可被检索。

**方案：**

- 前端路由 + `react-helmet-async` 或自定义 hook 动态注入 `<title>` / `<meta>` / OG 标签。
- 由于是 SPA，真正的 SSR 能力有限；**未来**若 SEO 要求提高，再迁移到 Next.js（数据层抽象不变，迁移成本低）。
- 图片懒加载、WebP/AVIF、字体 `display=swap`，保证 LCP 达标。

### 4.6 后台管理（V2 预留）

**难点：** 当前用 localStorage，数据「改起来」不直观。

**方案：**

- V1 阶段通过编辑 `src/api/local/storage.ts` 中的种子数据 + 提供「重置数据」入口维护内容。
- V2 阶段在 `ApiClient` 上扩展写操作（`create/update/delete`），`LocalStorageClient` 先实现本地写，再平移到 `HttpClient` 对接真实后端与管理界面。

### 4.7 可访问性

**要点（贯穿实现）：** 焦点态不丢失、图标按钮带 `aria-label`、装饰星点 `aria-hidden`、`prefers-reduced-motion` 全局生效、对比度满足 WCAG AA。

---

## 5. 与 PRD 的对应关系

| PRD 模块 | 技术落点 |
| --- | --- |
| 个人介绍 | `features/hero` + `Profile` 数据模型 |
| 技能展示 | `features/skills` + `Skill[]` |
| 项目展示 | `features/projects` + `Project[]` |
| 博客 | `features/blog` + `BlogPost[]` + react-markdown |
| 星空背景 | `effects/Starfield.tsx` + `hooks/useStarfield` |
| 数据层抽象 | `src/api/`（local 模拟 → http 未来替换） |

---

## 6. 实施顺序建议

1. 脚手架：Vite + React + TS + Tailwind + Router + 设计 token。
2. `src/api/` 数据层：`types.ts` → `storage.ts`（种子数据）→ `local/client.ts` → `index.ts`。
3. 布局壳：导航 + 星空背景 + 页脚。
4. 业务区块：Hero → 技能 → 项目 → 博客（按依赖顺序）。
5. 打磨：动效、响应式、可访问性、SEO、性能优化。
