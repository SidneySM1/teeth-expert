import { motion } from 'framer-motion'
import { differenceInYears, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, Mail, MessageCircle, Phone, Stethoscope } from 'lucide-react'
import type { Appointment } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PaymentBadge } from '@/components/ui/PaymentBadge'
import { Tip } from '@/components/ui/Tooltip'
import { currency, hhmm } from '@/lib/format'
import { paymentSummary } from '@/lib/payments'
import { whatsappUrl } from '@/lib/summary'
import './profile.css'

export function PatientProfile({
  patientId,
  onClose,
  onOpenAppointment,
}: {
  patientId: string | null
  onClose: () => void
  onOpenAppointment?: (apt: Appointment) => void
}) {
  const { patientById, appointments, procedures } = useClinic()
  const patient = patientId ? patientById(patientId) : undefined

  const history = patient
    ? appointments
        .filter((a) => a.patientId === patient.id)
        .sort((a, b) => b.start.localeCompare(a.start))
    : []

  const totals = history.reduce(
    (acc, a) => {
      const s = paymentSummary(a, procedures)
      acc.total += s.total
      acc.paid += s.paid
      acc.balance += s.balance
      return acc
    },
    { total: 0, paid: 0, balance: 0 },
  )
  const done = history.filter((a) => a.status === 'concluido').length
  const age = patient?.birthDate
    ? differenceInYears(new Date(), new Date(patient.birthDate))
    : null

  const procOf = (id: string) => procedures.find((p) => p.id === id)

  return (
    <Modal open={!!patient} onClose={onClose} width={640}>
      {patient && (
        <div className="profile">
          {/* Cabeçalho */}
          <div className="profile-head">
            <Avatar name={patient.name} size={64} />
            <div className="profile-id">
              <h3>{patient.name}</h3>
              <div className="profile-contacts">
                <span>
                  <Phone size={13} /> {patient.phone}
                </span>
                {patient.email && (
                  <span>
                    <Mail size={13} /> {patient.email}
                  </span>
                )}
                {age != null && <span className="profile-age">{age} anos</span>}
              </div>
            </div>
            <Tip label="Enviar WhatsApp">
              <a
                className="btn btn-icon pay-wa profile-wa"
                href={whatsappUrl(patient.phone, `Olá, ${patient.name.split(' ')[0]}!`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} />
              </a>
            </Tip>
          </div>

          {/* Indicadores */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span>Consultas</span>
              <strong>{history.length}</strong>
            </div>
            <div className="profile-stat">
              <span>Concluídas</span>
              <strong>{done}</strong>
            </div>
            <div className="profile-stat">
              <span>Total pago</span>
              <strong style={{ color: 'var(--st-concluido)' }}>
                {currency(totals.paid)}
              </strong>
            </div>
            <div className="profile-stat">
              <span>Em aberto</span>
              <strong
                style={{
                  color: totals.balance > 0 ? 'var(--st-atendimento)' : 'var(--text-mute)',
                }}
              >
                {currency(totals.balance)}
              </strong>
            </div>
          </div>

          {/* Timeline / prontuário */}
          <div className="profile-section-title">
            <Stethoscope size={15} /> Prontuário
          </div>

          {history.length === 0 ? (
            <p className="profile-empty">Nenhuma consulta registrada.</p>
          ) : (
            <div className="timeline">
              {history.map((a, i) => {
                const sum = paymentSummary(a, procedures)
                const items = a.treatmentItems ?? []
                const teeth = (a.toothMarks ?? []).filter((m) => m.procedureId)
                return (
                  <motion.div
                    key={a.id}
                    className="tl-node"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="tl-marker">
                      <span className="tl-dot" />
                      {i < history.length - 1 && <span className="tl-line" />}
                    </div>
                    <button
                      className="tl-card"
                      onClick={() => onOpenAppointment?.(a)}
                      style={{ cursor: onOpenAppointment ? 'pointer' : 'default' }}
                    >
                      <div className="tl-card-head">
                        <span className="tl-date">
                          <CalendarDays size={13} />
                          {format(new Date(a.start), "d MMM yyyy", { locale: ptBR })} ·{' '}
                          {hhmm(a.start)}
                        </span>
                        <div className="tl-badges">
                          <StatusBadge status={a.status} />
                          {sum.total > 0 && <PaymentBadge status={sum.status} />}
                        </div>
                      </div>

                      <div className="tl-procs">
                        {(items.length > 0
                          ? items.map((it) => ({
                              key: it.id,
                              name: procOf(it.procedureId)?.name ?? 'Procedimento',
                              color: procOf(it.procedureId)?.color,
                              tooth: it.tooth,
                            }))
                          : a.procedureIds.map((id) => ({
                              key: id,
                              name: procOf(id)?.name ?? 'Procedimento',
                              color: procOf(id)?.color,
                              tooth: undefined as number | undefined,
                            }))
                        ).map((p) => (
                          <span key={p.key} className="tl-proc">
                            <span
                              className="dot"
                              style={{ background: p.color ?? 'var(--text-mute)' }}
                            />
                            {p.name}
                            {p.tooth != null && (
                              <em className="tl-proc-tooth">#{p.tooth}</em>
                            )}
                          </span>
                        ))}
                      </div>

                      {a.executionNotes && (
                        <p className="tl-notes">{a.executionNotes}</p>
                      )}

                      {(teeth.length > 0 || sum.total > 0) && (
                        <div className="tl-card-foot">
                          {teeth.length > 0 ? (
                            <span className="muted">
                              {teeth.length} dente(s) tratado(s)
                            </span>
                          ) : (
                            <span />
                          )}
                          {sum.total > 0 && (
                            <strong className="tl-total">{currency(sum.total)}</strong>
                          )}
                        </div>
                      )}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
