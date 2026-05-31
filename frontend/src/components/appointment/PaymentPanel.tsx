import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, RotateCcw, Trash2, Undo2, Wallet } from 'lucide-react'
import { useState } from 'react'
import type { Appointment, PaymentMethod, Procedure } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Select } from '@/components/ui/Select'
import { Tip } from '@/components/ui/Tooltip'
import { currency } from '@/lib/format'
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_META,
  PAYMENT_STATUS_META,
  paymentSummary,
} from '@/lib/payments'

export function PaymentPanel({
  apt,
  procedures,
}: {
  apt: Appointment
  procedures: Procedure[]
}) {
  const { updateAppointment, addPayment, removePayment } = useClinic()
  const sum = paymentSummary(apt, procedures)
  const meta = PAYMENT_STATUS_META[sum.status]
  const pct = sum.total > 0 ? Math.min(100, (sum.paid / sum.total) * 100) : 0

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('pix')

  function registerPayment(value: number) {
    if (!value || value <= 0) return
    addPayment(apt.id, {
      amount: Math.round(value * 100) / 100,
      method,
      date: new Date().toISOString(),
    })
    setAmount('')
  }

  const isRefunded = sum.status === 'estornado'

  return (
    <div className="pay">
      {/* Resumo */}
      <div className="pay-summary card">
        <div className="pay-summary-head">
          <span className="badge" style={{ color: meta.color, background: meta.bg }}>
            <span className="dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
          {sum.discount > 0 && (
            <span className="muted pay-discount-tag">
              desconto {currency(sum.discount)}
            </span>
          )}
        </div>

        <div className="pay-figures">
          <div>
            <span className="muted">Total</span>
            <strong>{currency(sum.total)}</strong>
          </div>
          <div>
            <span className="muted">Pago</span>
            <strong style={{ color: 'var(--st-concluido)' }}>
              {currency(sum.paid)}
            </strong>
          </div>
          <div>
            <span className="muted">Saldo</span>
            <strong style={{ color: sum.balance > 0 ? 'var(--st-atendimento)' : 'var(--text-mute)' }}>
              {currency(sum.balance)}
            </strong>
          </div>
        </div>

        <div className="pay-bar">
          <motion.div
            className="pay-bar-fill"
            initial={false}
            animate={{ width: `${isRefunded ? 0 : pct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{ background: meta.color }}
          />
        </div>
      </div>

      {/* Desconto */}
      <div className="pay-row">
        <div className="field" style={{ flex: 1 }}>
          <label>Desconto (R$)</label>
          <input
            className="input"
            type="number"
            min={0}
            step={10}
            value={apt.discount ?? 0}
            onChange={(e) =>
              updateAppointment(apt.id, {
                discount: Math.max(0, Number(e.target.value) || 0),
              })
            }
          />
        </div>
        <div className="pay-gross">
          <span className="muted">Procedimentos</span>
          <strong>{currency(sum.gross)}</strong>
        </div>
      </div>

      {/* Novo pagamento */}
      {!isRefunded && sum.balance > 0 && (
        <div className="pay-new card">
          <label className="pay-new-title">
            <Wallet size={15} /> Registrar pagamento
          </label>
          <div className="pay-new-row">
            <input
              className="input"
              type="number"
              min={0}
              step={10}
              placeholder={currency(sum.balance)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select
              value={method}
              onChange={(v) => setMethod(v as PaymentMethod)}
              ariaLabel="Forma de pagamento"
              options={PAYMENT_METHODS.map((m) => ({
                value: m,
                label: `${PAYMENT_METHOD_META[m].icon}  ${PAYMENT_METHOD_META[m].label}`,
              }))}
            />
            <button
              className="btn btn-soft"
              onClick={() => registerPayment(Number(amount))}
              disabled={!amount || Number(amount) <= 0}
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <button
            className="btn btn-primary pay-full"
            onClick={() => registerPayment(sum.balance)}
          >
            Receber saldo · {currency(sum.balance)}
          </button>
        </div>
      )}

      {/* Lista de pagamentos */}
      {(apt.payments?.length ?? 0) > 0 && (
        <div className="pay-list">
          <label className="pay-list-title">Histórico</label>
          {apt.payments!.map((p) => (
            <motion.div
              key={p.id}
              className="pay-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="pay-item-icon">
                {PAYMENT_METHOD_META[p.method].icon}
              </span>
              <div className="pay-item-main">
                <strong>{PAYMENT_METHOD_META[p.method].label}</strong>
                <span className="muted">
                  {format(new Date(p.date), "d MMM yyyy · HH:mm", { locale: ptBR })}
                </span>
              </div>
              <span className="pay-item-amount">{currency(p.amount)}</span>
              <Tip label="Remover pagamento">
                <button
                  className="btn btn-icon btn-ghost pay-item-del"
                  onClick={() => removePayment(apt.id, p.id)}
                >
                  <Trash2 size={15} />
                </button>
              </Tip>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ações de status */}
      <div className="pay-actions">
        {isRefunded ? (
          <button
            className="btn btn-ghost"
            onClick={() =>
              updateAppointment(apt.id, { paymentStatusOverride: undefined })
            }
          >
            <Undo2 size={15} /> Reverter estorno
          </button>
        ) : (
          sum.paid > 0 && (
            <button
              className="btn btn-danger"
              onClick={() =>
                updateAppointment(apt.id, { paymentStatusOverride: 'estornado' })
              }
            >
              <RotateCcw size={15} /> Marcar como estornado
            </button>
          )
        )}
      </div>
    </div>
  )
}
