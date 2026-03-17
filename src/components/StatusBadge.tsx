import type { StatusInspecao } from '../types/inspecao'

const config: Record<StatusInspecao, { label: string; bg: string; color: string }> = {
  Rascunho: { label: 'Rascunho', bg: '#fef3c7', color: '#92400e' },
  Finalizado: { label: 'Finalizado', bg: '#dbeafe', color: '#1e40af' },
  Enviado: { label: 'Enviado', bg: '#dcfce7', color: '#166534' },
}

export default function StatusBadge({ status }: { status: StatusInspecao }) {
  const { label, bg, color } = config[status]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  )
}
