import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { useAuth } from './hooks/useAuth'

const navItems = [
  { to: '/admin', label: '仪表盘', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: '个人信息', icon: User },
  { to: '/admin/skills', label: '技能', icon: Wrench },
  { to: '/admin/projects', label: '项目', icon: FolderKanban },
  { to: '/admin/posts', label: '博客', icon: FileText },
  { to: '/admin/settings', label: '站点设置', icon: Settings },
]

export function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line/60 px-5 text-lg font-semibold">
        后台管理
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'
              }`
            }
          >
            <item.icon size={16} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-line/60 bg-surface md:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-56 border-r border-line/60 bg-surface">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="关闭菜单"
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-secondary hover:text-ink"
            >
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="md:ml-56">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line/60 bg-bg/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="打开菜单"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm text-ink-secondary">内容管理后台</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink-secondary transition-colors hover:text-ink"
          >
            <LogOut size={14} aria-hidden="true" />
            退出登录
          </button>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
