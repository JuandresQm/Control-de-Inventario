import type { FormEvent, ReactNode } from 'react'
import { Plus, Search, X } from 'lucide-react'

export function PageHeader({ description, action, secondaryAction }: { title: string; description: string; action?: () => void; secondaryAction?: { label: string; disabled?: boolean } }) {
  return <div className="page-header"><div><p className="muted">{description}</p></div><div className="page-actions">{secondaryAction && <button className="button button-secondary" type="button" disabled={secondaryAction.disabled}>{secondaryAction.label}</button>}{action && <button className="button button-primary" onClick={action}><Plus size={17} /> Nuevo</button>}</div></div>
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>
}

export function SearchBox({ value, onChange, placeholder = 'Buscar...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="search-box"><Search size={17} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>
}

export function Modal({ title, onClose, children, onSubmit, submitLabel = 'Guardar' }: { title: string; onClose: () => void; children: ReactNode; onSubmit: (event: FormEvent<HTMLFormElement>) => void; submitLabel?: string }) {
  return <div className="modal-backdrop" role="presentation"><form className="modal" onSubmit={onSubmit}><div className="modal-header"><h3>{title}</h3><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button></div><div className="modal-body">{children}</div><div className="modal-footer"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit">{submitLabel}</button></div></form></div>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>
}

export function EmptyState({ text = 'No hay registros para mostrar.' }: { text?: string }) {
  return <div className="empty-state">{text}</div>
}

export function formatDate(value: string) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
  const date = new Date(hasTimezone ? value : `${value}-04:00`)
  return new Intl.DateTimeFormat('es-VE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Caracas' }).format(date)
}
