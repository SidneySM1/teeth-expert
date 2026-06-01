import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Undo2,
  type LucideIcon,
} from 'lucide-react'
import type { PaymentStatus } from '@/types'
import { PAYMENT_STATUS_META } from '@/lib/payments'
import { Tip } from './Tooltip'

const ICONS: Record<PaymentStatus, LucideIcon> = {
  pendente: Clock3,
  parcial: CircleDollarSign,
  pago: BadgeCheck,
  estornado: Undo2,
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const m = PAYMENT_STATUS_META[status]
  const Icon = ICONS[status]
  return (
    <Tip label={`Status do pagamento: ${m.label}`}>
      <span className="badge" style={{ color: m.color, background: m.bg }}>
        <Icon size={12} strokeWidth={2.4} />
        {m.label}
      </span>
    </Tip>
  )
}
