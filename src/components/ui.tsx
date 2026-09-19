import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, X } from 'lucide-react'

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

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
      className={cn('button', `button--${variant}`, `button--${size}`, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="button__spinner" aria-label="Loading" /> : null}
      {children}
    </button>
  )
}

export function Card({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <section className={cn('card', className)} style={style}>{children}</section>
}

export function Tag({ children, tone = 'slate', className, style }: { children: ReactNode; tone?: 'slate' | 'blue' | 'teal' | 'amber' | 'rose' | 'violet'; className?: string; style?: React.CSSProperties }) {
  return <span className={cn('tag', `tag--${tone}`, className)} style={style}>{children}</span>
}

export function ScoreBadge({ score, label = 'match' }: { score: number; label?: string }) {
  const tone = score >= 80 ? 'high' : score >= 65 ? 'medium' : 'low'
  return <span className={cn('score-badge', `score-badge--${tone}`)}>{score}% {label}</span>
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string
  title: string
  copy?: string
  action?: ReactNode
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {copy ? <p className="section-heading__copy">{copy}</p> : null}
      </div>
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  )
}

export function InlineNotice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'success' | 'warning' }) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'warning' ? AlertCircle : AlertCircle
  return <div className={cn('inline-notice', `inline-notice--${tone}`)}><Icon size={18} /> <span>{children}</span></div>
}

export function EmptyState({
  title,
  copy,
  action,
}: {
  title: string
  copy: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark"><ArrowRight size={22} /></div>
      <h3>{title}</h3>
      <p>{copy}</p>
      {action}
    </div>
  )
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
