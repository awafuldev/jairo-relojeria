/**
 * Shared admin UI utilities for Jairo Relojería
 * Isomorphic: safe to import in Server Components and Client Components
 */

// Status configuration map
export const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string; labelEn: string }> = {
  draft:       { bg: 'bg-[#F5F4F2]',  text: 'text-[#78716C]',  dot: 'bg-[#A8A29E]',  label: 'Borrador',        labelEn: 'Draft' },
  saved:       { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-400',   label: 'Guardado',        labelEn: 'Saved' },
  pending:     { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-400',  label: 'Pendiente',       labelEn: 'Pending' },
  ordered:     { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',  label: 'Pedido',          labelEn: 'Ordered' },
  confirmed:   { bg: 'bg-green-50',    text: 'text-green-700',   dot: 'bg-green-500',  label: 'Confirmado',      labelEn: 'Confirmed' },
  in_progress: { bg: 'bg-purple-50',   text: 'text-purple-700',  dot: 'bg-purple-500', label: 'En preparación',  labelEn: 'In Progress' },
  completed:   { bg: 'bg-[#0A0D0F]',   text: 'text-white',       dot: 'bg-[#1DD8E1]',  label: 'Completado',      labelEn: 'Completed' },
  cancelled:   { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-400',    label: 'Cancelado',       labelEn: 'Cancelled' },
}

export function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'xs' | 'sm' | 'md' }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  const sizeClass = size === 'xs'
    ? 'text-[9px] px-1.5 py-0.5'
    : size === 'md'
    ? 'text-[11px] px-2.5 py-1'
    : 'text-[10px] px-2 py-0.5'

  return (
    <span className={`status-badge ${s.bg} ${s.text} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1.5 inline-block`} />
      {s.label}
    </span>
  )
}

export const VALID_STATUSES = ['draft', 'saved', 'pending', 'ordered', 'confirmed', 'in_progress', 'completed', 'cancelled']

export const STATUS_FLOW = [
  { value: 'pending', label: 'Pendiente de confirmación' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'in_progress', label: 'En preparación' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

// Format currency
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date  
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (format === 'long') {
    return d.toLocaleDateString('es-DO', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }
  if (format === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} días`
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`
    return d.toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString('es-DO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default StatusBadge
