import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-6 text-ink-secondary">页面不存在</p>
      <Link to="/" className="text-accent hover:underline">
        返回首页
      </Link>
    </div>
  )
}
