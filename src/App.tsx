import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Starfield } from '@/effects/Starfield'
import { AppRoutes } from '@/router'

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <Starfield />
      <Navbar />
      <main className="relative">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}
