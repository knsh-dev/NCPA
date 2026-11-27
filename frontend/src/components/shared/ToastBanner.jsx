import { AlertCircle, CheckCircle2, Info, RotateCcw, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

export function ToastBanner() {
  const { toast, dismissToast } = useApp()
  if (!toast) return null

  const Icon =
    toast.tone === 'error'
      ? AlertCircle
      : toast.tone === 'neutral'
        ? Info
        : CheckCircle2

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md">
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg',
          toast.tone === 'error'
            ? 'border-[#b0453a] bg-[#fbf8f1] text-[#b0453a]'
            : 'border-[#6b8f57] bg-[#2f5233] text-[#f5f1e6]'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{toast.message}</span>
        {toast.undoAction && (
          <button
            type="button"
            onClick={() => {
              toast.undoAction()
              dismissToast()
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-[#f5f1e6] px-2.5 py-1 text-xs font-bold text-[#2f5233] hover:bg-[#ede7d6] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Undo
          </button>
        )}
        <button
          type="button"
          onClick={dismissToast}
          className="rounded p-0.5 opacity-75 hover:opacity-100 cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
