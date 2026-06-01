import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Appointment, Patient, Procedure } from '@/types'
import { currency } from './format'
import { PAYMENT_STATUS_META, type PaymentSummary } from './payments'

const CLINIC_NAME = 'Teeth Expert'

/** Monta o texto do resumo do atendimento para enviar ao paciente. */
export function buildSummaryText(
  patient: Patient,
  apt: Appointment,
  procedures: Procedure[],
  sum: PaymentSummary,
): string {
  const firstName = patient.name.split(/\s+/)[0]
  const dateStr = format(new Date(apt.start), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })
  const procOf = (id: string) => procedures.find((p) => p.id === id)

  const items = apt.treatmentItems ?? []
  const lines: string[] = []
  lines.push(`Olá, ${firstName}! 🦷`)
  lines.push(`Segue o resumo do seu atendimento na ${CLINIC_NAME}.`)
  lines.push('')
  lines.push(`Data: ${dateStr}`)
  lines.push('')
  lines.push('Procedimentos realizados:')

  if (items.length > 0) {
    for (const it of items) {
      const name = procOf(it.procedureId)?.name ?? 'Procedimento'
      const tooth = it.tooth != null ? ` (dente ${it.tooth})` : ''
      lines.push(`• ${name}${tooth} — ${currency(it.price)}`)
    }
  } else {
    for (const id of apt.procedureIds) {
      const p = procOf(id)
      if (p) lines.push(`• ${p.name} — ${currency(p.price)}`)
    }
  }

  lines.push('')
  if (sum.discount > 0) {
    lines.push(`Subtotal: ${currency(sum.gross)}`)
    lines.push(`Desconto: -${currency(sum.discount)}`)
  }
  lines.push(`Total: ${currency(sum.total)}`)
  if (sum.paid > 0) lines.push(`Pago: ${currency(sum.paid)}`)
  if (sum.balance > 0) lines.push(`Saldo a pagar: ${currency(sum.balance)}`)
  lines.push(`Situação: ${PAYMENT_STATUS_META[sum.status].label}`)
  lines.push('')
  lines.push('Qualquer dúvida, estamos à disposição. Cuide do seu sorriso! 😄')

  return lines.join('\n')
}

/** Link wa.me — assume Brasil (+55) quando o DDI não está presente. */
export function whatsappUrl(phone: string, text: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.length <= 11) digits = '55' + digits
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function mailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`
}
