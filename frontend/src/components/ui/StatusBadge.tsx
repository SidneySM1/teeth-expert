import {
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Stethoscope,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type { AppointmentStatus } from '@/types'
import { STATUS_META } from '@/lib/format'
import { Tip } from './Tooltip'

const ICONS: Record<AppointmentStatus, LucideIcon> = {
  agendado: CalendarClock,
  confirmado: CalendarCheck2,
  em_atendimento: Stethoscope,
  concluido: CheckCircle2,
  cancelado: XCircle,
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const m = STATUS_META[status]
  const Icon = ICONS[status]
  return (
    <Tip label={`Status da consulta: ${m.label}`}>
      <span className="badge" style={{ color: m.color, background: m.bg }}>
        <Icon size={12} strokeWidth={2.4} />
        {m.label}
      </span>
    </Tip>
  )
}
