import type { StatusInspecao } from '../types/inspecao'

const config: Record<StatusInspecao, { label: string; bg: string; color: string; dot: string }> = {
  Rascunho: { label: 'Rascunho', bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  Finalizado: { label: 'Finalizado', bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  Enviado: { label: 'Enviado', bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
}

export default function StatusBadge({ status }: { status: StatusInspecao }) {
  const { label, bg, color, dot } = config[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </span>
  )
}
