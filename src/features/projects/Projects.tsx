import { Code, ExternalLink } from 'lucide-react'
import { api } from '@/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Section } from '@/components/Section'
import { Tag } from '@/components/Tag'

export function Projects() {
  const { status, data, error } = useAsyncData(() => api.getProjects(), [])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />
  if (!data || data.length === 0) return <EmptyNotice message="暂无项目数据。" />

  const sorted = [...data].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.order - a.order,
  )

  return (
    <Section id="projects" title="项目" subtitle="精选的代表性项目">
      <div className="grid gap-6 md:grid-cols-2">
        {sorted.map((project) => (
          <article
            key={project.id}
            className="flex flex-col rounded-xl border border-line/60 bg-surface p-6 transition-colors hover:border-accent/60"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              {project.featured && <Tag>精选</Tag>}
            </div>

            <p className="mb-4 text-sm text-ink-secondary">{project.summary}</p>

            <div className="mb-5 flex flex-wrap gap-2">
              {project.techTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <div className="mt-auto flex gap-4">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  在线
                </a>
              )}
              {project.links.source && (
                <a
                  href={project.links.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink"
                >
                  <Code size={14} aria-hidden="true" />
                  源码
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
