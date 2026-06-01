import * as HC from '@radix-ui/react-hover-card'
import { CalendarDays, Clock } from 'lucide-react'
import type { ReactNode } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Appointment } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { currency, hhmm } from '@/lib/format'
import { PAYMENT_STATUS_META, paymentSummary } from '@/lib/payments'
import './hovercard.css'

export function AppointmentHoverCard({
  appointment,
  children,
  side = 'right',
}: {
  appointment: Appointment
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const { patientById, procedureById, procedures } = useClinic()
  const patient = patientById(appointment.patientId)
  const procs = appointment.procedureIds
    .map(procedureById)
    .filter(Boolean) as NonNullable<ReturnType<typeof procedureById>>[]
  const sum = paymentSummary(appointment, procedures)
  const pm = PAYMENT_STATUS_META[sum.status]

  if (!patient) return <>{children}</>

  return (
    <HC.Root openDelay={180} closeDelay={80}>
      <HC.Trigger asChild>{children}</HC.Trigger>
      <HC.Portal>
        <HC.Content className="hc" side={side} sideOffset={10} collisionPadding={12}>
          <div className="hc-head">
            <Avatar name={patient.name} size={38} />
            <div className="hc-id">
              <strong>{patient.name}</strong>
              <span className="muted">{patient.phone}</span>
            </div>
          </div>

          <div className="hc-when">
            <span>
              <CalendarDays size={13} />
              {format(new Date(appointment.start), "EEE, d MMM", { locale: ptBR })}
            </span>
            <span>
              <Clock size={13} />
              {hhmm(appointment.start)}–{hhmm(appointment.end)}
            </span>
          </div>

          {procs.length > 0 && (
            <div className="hc-procs">
              {procs.map((p) => (
                <span key={p.id} className="hc-proc">
                  <span className="dot" style={{ background: p.color }} />
                  {p.name}
                </span>
              ))}
            </div>
          )}

          <div className="hc-foot">
            <div className="hc-badges">
              <StatusBadge status={appointment.status} />
              <span className="badge" style={{ color: pm.color, background: pm.bg }}>
                {pm.label}
              </span>
            </div>
            {sum.total > 0 && (
              <strong className="hc-total">{currency(sum.total)}</strong>
            )}
          </div>

          <HC.Arrow className="hc-arrow" width={12} height={6} />
        </HC.Content>
      </HC.Portal>
    </HC.Root>
  )
}
