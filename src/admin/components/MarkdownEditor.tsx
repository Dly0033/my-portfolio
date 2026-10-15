import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { inputClass } from './fields'

/** Markdown 编辑器：左侧源码 + 右侧实时预览（复用前台渲染方案，不启用 rehype-raw）。 */
export function MarkdownEditor({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          正文（Markdown）
        </label>
        <textarea
          id={id}
          rows={16}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} border-line font-mono leading-relaxed`}
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">实时预览</p>
        <div className="markdown max-h-[32rem] overflow-y-auto rounded-lg border border-line bg-surface p-4 text-sm">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-ink-secondary">暂无内容</p>
          )}
        </div>
      </div>
    </div>
  )
}
