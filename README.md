# My Portfolio

个人展示网站：深色星空主题的单页作品集 + 博客，附带内容管理后台。

## 技术栈

React 18 + TypeScript + Vite + Tailwind CSS，数据层统一收敛在 `src/api/`（当前用 localStorage 模拟后端）。

## 快速开始

```bash
pnpm install
pnpm dev        # 启动开发服务器
pnpm lint       # ESLint
pnpm test       # Vitest
pnpm build      # 类型检查 + 生产构建
```

## 后台管理

访问地址：`/admin`（未登录会跳转到 `/admin/login`）。

**默认登录账号 / 密码：**

| 账号 | 密码 |
| --- | --- |
| `admin` | `admin123` |

> 说明：当前为纯前端演示实现，登录仅在前端本地比对账号密码，并在 `localStorage` 中保存登录 token（不保存明文密码）。接入真实后端后，应由服务端完成鉴权并下发 token。

后台可管理：个人信息、技能、项目、博客、站点设置。前台首页的个人信息与站点标题均读取自同一数据层，后台修改后刷新前台即可看到变化。
