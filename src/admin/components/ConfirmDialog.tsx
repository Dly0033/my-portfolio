interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** 删除等危险操作的二次确认对话框。 */
export function ConfirmDialog({ open, title, message, busy, onCancel, onConfirm }: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6">
        <h3 id="confirm-dialog-title" className="mb-2 text-lg font-semibold">
          {title}
        </h3>
        <p className="mb-6 text-sm text-ink-secondary">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-lg border border-line px-4 py-2 text-sm text-ink-secondary transition-colors hover:text-ink"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
