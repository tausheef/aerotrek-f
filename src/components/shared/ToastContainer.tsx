import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '../../store/uiStore'
import type { Toast, ToastType } from '../../store/uiStore'
import clsx from 'clsx'

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error:   <XCircle    size={18} className="text-red-500   shrink-0" />,
  info:    <Info       size={18} className="text-brand-sky shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
}

const BORDER: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error:   'border-l-red-500',
  info:    'border-l-brand-sky',
  warning: 'border-l-amber-500',
}

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove)

  return (
    <div
      className={clsx(
        'toast-enter flex items-start gap-3 w-full max-w-sm',
        'bg-white rounded-xl shadow-card-hover border border-black/6 border-l-4 p-4',
        BORDER[toast.type]
      )}
    >
      {ICONS[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-sans font-semibold text-sm text-[var(--text-primary)] mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="font-body text-sm text-[var(--text-secondary)] leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => remove(toast.id)}
        className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
