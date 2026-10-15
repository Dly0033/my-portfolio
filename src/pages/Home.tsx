import { Contact } from '@/features/contact/Contact'
import { About } from '@/features/hero/About'
import { Hero } from '@/features/hero/Hero'
import { Projects } from '@/features/projects/Projects'
import { Skills } from '@/features/skills/Skills'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  )
}
