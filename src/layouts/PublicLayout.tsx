import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Starfield } from '@/effects/Starfield'

/** 前台布局壳：导航 + 星空 + 页脚（后台不经过此布局） */
export default function PublicLayout() {
  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <Starfield />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
