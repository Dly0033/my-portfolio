export function Loading({ label = '加载中…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-ink-secondary" role="status">
      <span
        aria-hidden="true"
        className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"
      />
      {label}
    </div>
  )
}

export function ErrorNotice({ message = '加载失败，请稍后重试。' }: { message?: string }) {
  return (
    <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
      {message}
    </div>
  )
}

export function EmptyNotice({ message = '暂无内容。' }: { message?: string }) {
  return <p className="py-12 text-center text-ink-secondary">{message}</p>
}
