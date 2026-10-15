import { api } from '@/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { groupBy } from '@/lib/format'
import { EmptyNotice, ErrorNotice, Loading } from '@/components/Status'
import { Section } from '@/components/Section'

const levelLabel: Record<string, string> = {
  familiar: '熟悉',
  skilled: '熟练',
  expert: '精通',
}

export function Skills() {
  const { status, data, error } = useAsyncData(() => api.getSkills(), [])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error.message} />
  if (!data || data.length === 0) return <EmptyNotice message="暂无技能数据。" />

  const groups = groupBy(data, (skill) => skill.category)

  return (
    <Section id="skills" title="技能" subtitle="我的技术栈与熟练程度">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.keys(groups).map((category) => (
          <div key={category} className="rounded-xl border border-line/60 bg-surface p-6">
            <h3 className="mb-4 text-lg font-semibold">{category}</h3>
            <ul className="space-y-3">
              {groups[category].map((skill) => (
                <li key={skill.id} className="flex items-center justify-between">
                  <span className="text-sm">{skill.name}</span>
                  <span className="text-xs text-ink-secondary">
                    {levelLabel[skill.level] ?? skill.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
