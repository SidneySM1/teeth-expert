import type {
  Appointment,
  PaymentMethod,
  PaymentStatus,
  Procedure,
} from '@/types'

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; color: string; bg: string }
> = {
  pendente: { label: 'Pendente', color: '#b45309', bg: '#fef0d9' },
  parcial: { label: 'Parcial', color: '#4f46e5', bg: '#eef0fe' },
  pago: { label: 'Pago', color: '#15803d', bg: '#dcfce7' },
  estornado: { label: 'Estornado', color: '#dc2626', bg: '#fee2e2' },
}

export const PAYMENT_METHOD_META: Record<
  PaymentMethod,
  { label: string; icon: string }
> = {
  dinheiro: { label: 'Dinheiro', icon: '💵' },
  pix: { label: 'Pix', icon: '⚡' },
  credito: { label: 'Crédito', icon: '💳' },
  debito: { label: 'Débito', icon: '🏦' },
  transferencia: { label: 'Transferência', icon: '🔁' },
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  'dinheiro',
  'pix',
  'credito',
  'debito',
  'transferencia',
]

export interface PaymentSummary {
  gross: number // soma dos procedimentos
  discount: number
  total: number // gross - discount (mín. 0)
  paid: number // soma dos pagamentos
  balance: number // total - paid (mín. 0)
  status: PaymentStatus
}

/** Calcula o resumo financeiro de uma consulta.
 *  O valor existe SOMENTE a partir dos itens realizados no atendimento —
 *  antes disso não há orçamento, então o total é zero. */
export function paymentSummary(
  apt: Appointment,
  _procedures: Procedure[],
): PaymentSummary {
  const items = apt.treatmentItems ?? []
  const gross = items.reduce((s, it) => s + (it.price || 0), 0)
  const discount = Math.min(apt.discount ?? 0, gross)
  const total = Math.max(0, gross - discount)
  const paid = (apt.payments ?? []).reduce((s, p) => s + p.amount, 0)
  const balance = Math.max(0, total - paid)

  let status: PaymentStatus
  if (apt.paymentStatusOverride) {
    status = apt.paymentStatusOverride
  } else if (total > 0 && paid >= total) {
    status = 'pago'
  } else if (paid > 0) {
    status = 'parcial'
  } else {
    status = 'pendente'
  }

  return { gross, discount, total, paid, balance, status }
}
