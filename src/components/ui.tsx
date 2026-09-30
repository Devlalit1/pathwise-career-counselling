import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, X } from 'lucide-react'

// ─── Utility ────────────────────────────────────────────────────────────────

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

// ─── Button ─────────────────────────────────────────────────────────────────

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn('button', `button--${variant}`, `button--${size}`, loading && 'button--loading', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner" style={{ width: 15, height: 15 }} aria-hidden />}
      {children}
    </button>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className,
  style,
  flat,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  flat?: boolean
}) {
  return (
    <section className={cn('card', flat && 'card--flat', className)} style={style}>
      {children}
    </section>
  )
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

export function Tag({
  children,
  tone = 'slate',
  className,
  style,
}: {
  children: ReactNode
  tone?: 'slate' | 'blue' | 'teal' | 'amber' | 'rose' | 'violet'
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={cn('tag', `tag--${tone}`, className)} style={style}>
      {children}
    </span>
  )
}

// ─── ScoreBadge ──────────────────────────────────────────────────────────────

export function ScoreBadge({ score, label = 'match' }: { score: number; label?: string }) {
  const tone = score >= 80 ? 'high' : score >= 65 ? 'medium' : 'low'
  return (
    <span className={cn('score-badge', `score-badge--${tone}`)}>
      {score}% {label}
    </span>
  )
}

// ─── SectionHeading ──────────────────────────────────────────────────────────

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
  center,
}: {
  eyebrow?: string
  title: string
  copy?: string
  action?: ReactNode
  center?: boolean
}) {
  return (
    <div className="section-heading" style={center ? { textAlign: 'center', display: 'block' } : undefined}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {copy ? <p className="section-heading__copy">{copy}</p> : null}
      </div>
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  )
}

// ─── InlineNotice ────────────────────────────────────────────────────────────

export function InlineNotice({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: 'info' | 'success' | 'warning'
}) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle
  return (
    <div className={cn('inline-notice', `inline-notice--${tone}`)}>
      <Icon size={18} />
      <span>{children}</span>
    </div>
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  copy,
  action,
}: {
  icon?: ReactNode
  title: string
  copy: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark">{icon ?? <ArrowRight size={22} />}</div>
      <h3>{title}</h3>
      <p>{copy}</p>
      {action}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export function Modal({
  open,
  title,
  children,
  onClose,
  size = 'md',
}: {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 420, md: 540, lg: 720 }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="modal animate-scale-in"
        style={{ width: `min(100%, ${widths[size]}px)` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal__header">
            <h2 id="modal-title">{title}</h2>
            <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
              <X size={19} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn('spinner', className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function Skeleton({
  className,
  style,
  width,
  height,
}: {
  className?: string
  style?: React.CSSProperties
  width?: number | string
  height?: number | string
}) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width, height, ...style }}
      aria-hidden
    />
  )
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

export function Tabs({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={cn('tabs', className)} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          className={cn('tab', value === opt.value && 'is-active')}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── ProgressRing ────────────────────────────────────────────────────────────

export function ProgressRing({
  pct,
  size = 66,
  stroke = 6,
  className,
  label,
}: {
  pct: number
  size?: number
  stroke?: number
  className?: string
  label?: string
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-label={label ?? `${pct}% progress`}
    >
      <circle className="progress-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <circle
        className="progress-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
    </svg>
  )
}

// ─── ErrorBoundary ───────────────────────────────────────────────────────────

interface EBState { error: Error | null }

export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  EBState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: '#64748b', marginBottom: 20, fontSize: '.9rem' }}>
              {this.state.error.message}
            </p>
            <button
              className="button button--primary button--md"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}

// ─── Toast system ────────────────────────────────────────────────────────────

export type ToastKind = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  kind: ToastKind
  title: string
  message?: string
  duration?: number
}

interface ToastCtx {
  show: (t: Omit<ToastData, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastCtx>({ show: () => {}, dismiss: () => {} })

const ICONS: Record<ToastKind, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'i',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<(ToastData & { leaving?: boolean })[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300)
  }, [])

  const show = useCallback(
    (t: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev.slice(-4), { ...t, id }])
      setTimeout(() => dismiss(id), t.duration ?? 4500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn('toast', `toast--${t.kind}`, t.leaving && 'is-leaving')}
            role="alert"
          >
            <span className="toast__icon">{ICONS[t.kind]}</span>
            <div className="toast__body">
              <div className="toast__title">{t.title}</div>
              {t.message && <div className="toast__msg">{t.message}</div>}
            </div>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
