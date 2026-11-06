import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

type ToastKind = 'success' | 'error' | 'warning' | 'info'
interface ToastItem { id: number; kind: ToastKind; message: string }
interface ToastContextValue { showToast: (message: string, kind?: ToastKind) => void }
const ToastContext = createContext<ToastContextValue | null>(null)
const icons = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, kind, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500)
  }, [])
  const value = useMemo(() => ({ showToast }), [showToast])
  return <ToastContext.Provider value={value}>{children}<div className="toast-container" aria-live="polite">{toasts.map((toast) => { const Icon = icons[toast.kind]; return <div className={`toast toast-${toast.kind}`} key={toast.id}><Icon size={18} /><span>{toast.message}</span><button className="toast-close" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} aria-label="Cerrar notificación"><X size={15} /></button></div> })}</div></ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider')
  return context
}
