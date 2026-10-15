import { MapPin } from 'lucide-react'
import { api } from '@/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Section } from '@/components/Section'

export function About() {
  const { status, data, error } = useAsyncData(() => api.getProfile(), [])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />
  if (!data) return <EmptyNotice message="暂无个人资料。" />

  return (
    <Section id="about" title="关于我" subtitle="了解我的背景与经历">
      <div className="max-w-3xl space-y-4 text-ink-secondary">
        {data.summary.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        {data.location && (
          <p className="flex items-center gap-1">
            <MapPin size={16} aria-hidden="true" />
            {data.location}
          </p>
        )}

        {data.socials.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            {data.socials.map((social) => {
              const isExternal = social.url.startsWith('http')
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="text-sm text-accent hover:underline"
                >
                  {social.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </Section>
  )
}
