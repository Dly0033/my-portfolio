import { Mail } from 'lucide-react'
import { api } from '@/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'

export function Hero() {
  const { status, data, error } = useAsyncData(() => api.getProfile(), [])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />
  if (!data) return <EmptyNotice message="暂无个人资料。" />

  return (
    <section id="hero" className="relative flex min-h-[calc(100vh-4rem)] items-center px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {data.roles.length > 0 && (
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            {data.roles.join(' · ')}
          </p>
        )}

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          {data.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-ink-secondary sm:text-xl">{data.tagline}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-2"
          >
            查看项目
          </a>
          <a
            href={`mailto:${data.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <Mail size={16} aria-hidden="true" />
            联系我
          </a>
        </div>

        {data.stats && (
          <dl className="mt-12 flex flex-wrap gap-8">
            {data.stats.yearsOfExperience != null && (
              <div>
                <dt className="text-sm text-ink-secondary">工作年限</dt>
                <dd className="text-2xl font-semibold">{data.stats.yearsOfExperience}+ 年</dd>
              </div>
            )}
            {data.stats.projectsCount != null && (
              <div>
                <dt className="text-sm text-ink-secondary">项目</dt>
                <dd className="text-2xl font-semibold">{data.stats.projectsCount}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </section>
  )
}
