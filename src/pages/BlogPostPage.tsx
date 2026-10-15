import { useParams } from 'react-router-dom'
import { BlogPostDetail } from '@/features/blog/BlogPostDetail'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <div className="px-4 py-24 text-center text-ink-secondary">缺少文章标识。</div>
  }

  return <BlogPostDetail slug={slug} />
}
