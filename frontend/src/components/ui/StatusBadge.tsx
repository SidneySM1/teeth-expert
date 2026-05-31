import type { AppointmentStatus } from '@/types'
import { STATUS_META } from '@/lib/format'

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="badge" style={{ color: m.color, background: m.bg }}>
      <span className="dot" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}
