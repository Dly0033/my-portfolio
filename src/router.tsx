import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
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
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
