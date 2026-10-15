import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api'
import type { Profile } from '@/api'
import { ErrorNotice, Loading } from '@/components/Status'
import { PageHeader } from '../components/PageHeader'

interface Stats {
  skills: number
  projects: number
  posts: number
  messages: number
}

export function DashboardPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([
      api.getProfile(),
      api.getSkills(),
      api.getProjects(),
      api.getPosts(),
      api.getMessages(),
    ])
      .then(([p, skills, projects, posts, messages]) => {
        if (!active) return
        setProfile(p)
        setStats({
          skills: skills.length,
          projects: projects.length,
          posts: posts.length,
          messages: messages.length,
        })
        setStatus('success')
      })
      .catch((err: unknown) => {
        if (!active) return
        setStatus('error')
        setError(err instanceof Error ? err : new Error(String(err)))
      })

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorNotice message={error?.message} />
  if (!stats) return null

  const cards: { label: string; value: number; to?: string }[] = [
    { label: '技能', value: stats.skills, to: '/admin/skills' },
    { label: '项目', value: stats.projects, to: '/admin/projects' },
    { label: '博客', value: stats.posts, to: '/admin/posts' },
    { label: '联系消息', value: stats.messages },
  ]

  return (
    <div>
      <PageHeader title="仪表盘" subtitle="内容统计概览" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const inner = (
            <>
              <p className="text-sm text-ink-secondary">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold">{card.value}</p>
            </>
          )
          const cls = 'rounded-xl border border-line/60 bg-surface p-5'
          return card.to ? (
            <Link key={card.label} to={card.to} className={`${cls} transition-colors hover:border-accent/60`}>
              {inner}
            </Link>
          ) : (
            <div key={card.label} className={cls}>
              {inner}
            </div>
          )
        })}
      </div>

      {profile && (
        <div className="mt-6 rounded-xl border border-line/60 bg-surface p-5">
          <p className="text-sm text-ink-secondary">当前展示的个人信息</p>
          <p className="mt-1 text-lg font-semibold">
            {profile.name} · {profile.tagline}
          </p>
        </div>
      )}
    </div>
  )
}
