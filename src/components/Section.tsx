import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mb-10 text-ink-secondary">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
