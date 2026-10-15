import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getSession } from '@/api'

/** 路由守卫：未登录跳转到 /admin/login，并记录来源以便登录后回跳。 */
export function RequireAuth() {
  const location = useLocation()

  if (!getSession()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
