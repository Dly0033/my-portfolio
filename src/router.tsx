import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AdminApp } from '@/admin/AdminApp'
import PublicLayout from '@/layouts/PublicLayout'
import Blog from '@/pages/Blog'
import BlogPostPage from '@/pages/BlogPostPage'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash, pathname])

  return null
}

export function AppRoutes() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        {/* 后台路由与前台隔离，使用独立布局 */}
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
