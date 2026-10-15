import { ArrowUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-line/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-sm text-ink-secondary">
          © {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
        <a
          href="#hero"
          className="inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-ink"
        >
          返回顶部 <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
