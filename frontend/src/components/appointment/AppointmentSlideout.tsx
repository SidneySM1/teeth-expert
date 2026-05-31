import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Pencil,
  Phone,
  Stethoscope,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type {
  AnamnesisAnswers,
  Appointment,
  AppointmentStatus,
  Procedure,
  ToothMark,
} from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Odontogram } from '@/components/odontogram/Odontogram'
import { Anamnesis } from './Anamnesis'
import { Tip } from '@/components/ui/Tooltip'
import { STATUS_META, currency, durationLabel, hhmm } from '@/lib/format'
import './slideout.css'

const STATUSES: AppointmentStatus[] = [
  'agendado',
  'confirmado',
  'em_atendimento',
  'concluido',
  'cancelado',
]

interface Props {
  appointment: Appointment | null
  onClose: () => void
  onEdit: (apt: Appointment) => void
}

type Tab = 'detalhes' | 'atendimento'

export function AppointmentSlideout({ appointment, onClose, onEdit }: Props) {
  const { patientById, procedureById, updateAppointment, removeAppointment } =
    useClinic()
  const [tab, setTab] = useState<Tab>('detalhes')

  // estado local de execução (sincronizado ao trocar de consulta)
  const [anamnesis, setAnamnesis] = useState<AnamnesisAnswers | undefined>()
  const [marks, setMarks] = useState<ToothMark[]>([])
  const [execNotes, setExecNotes] = useState('')

  useEffect(() => {
    if (appointment) {
      setAnamnesis(appointment.anamnesis)
      setMarks(appointment.toothMarks ?? [])
      setExecNotes(appointment.executionNotes ?? '')
      setTab('detalhes')
    }
  }, [appointment?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const apt = appointment
  const patient = apt ? patientById(apt.patientId) : undefined
  const procs: Procedure[] = apt
    ? (apt.procedureIds.map(procedureById).filter(Boolean) as Procedure[])
    : []
  const total = procs.reduce((s, p) => s + p.price, 0)

  function persist(extra?: Partial<Appointment>) {
    if (!apt) return
    updateAppointment(apt.id, {
      anamnesis,
      toothMarks: marks,
      executionNotes: execNotes.trim() || undefined,
      ...extra,
    })
  }

  function startService() {
    persist({ status: 'em_atendimento' })
    setTab('atendimento')
  }
  function finishService() {
    persist({ status: 'concluido' })
  }

  // auto-persist da execução quando edita (debounce simples)
  useEffect(() => {
    if (!apt || tab !== 'atendimento') return
    const t = setTimeout(() => persist(), 500)
    return () => clearTimeout(t)
  }, [anamnesis, marks, execNotes]) // eslint-disable-line react-hooks/exhaustive-deps

  const plannedTeeth = marks.filter((m) => m.procedureId)
  const doneTeeth = plannedTeeth.filter((m) => m.done)

  return (
    <AnimatePresence>
      {apt && patient && (
        <>
          <motion.div
            className="slideout-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="slideout"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            {/* Cabeçalho */}
            <header className="so-head">
              <div className="so-head-top">
                <StatusBadge status={apt.status} />
                <div className="row" style={{ gap: 6 }}>
                  <Tip label="Editar consulta">
                    <button
                      className="btn btn-icon btn-ghost"
                      onClick={() => onEdit(apt)}
                    >
                      <Pencil size={16} />
                    </button>
                  </Tip>
                  <Tip label="Excluir consulta">
                    <button
                      className="btn btn-icon btn-danger"
                      onClick={() => {
                        removeAppointment(apt.id)
                        onClose()
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </Tip>
                  <Tip label="Fechar">
                    <button className="btn btn-icon btn-ghost" onClick={onClose}>
                      <X size={18} />
                    </button>
                  </Tip>
                </div>
              </div>

              <div className="so-patient">
                <Avatar name={patient.name} size={52} />
                <div>
                  <h3>{patient.name}</h3>
                  <div className="so-meta">
                    <span>
                      <Phone size={13} /> {patient.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="so-when">
                <span>
                  <CalendarDays size={15} />
                  {format(new Date(apt.start), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </span>
                <span>
                  <Clock size={15} />
                  {hhmm(apt.start)} – {hhmm(apt.end)}
                </span>
              </div>

              <div className="so-tabs">
                <button
                  className={tab === 'detalhes' ? 'so-tab active' : 'so-tab'}
                  onClick={() => setTab('detalhes')}
                >
                  <ClipboardList size={16} /> Detalhes
                </button>
                <button
                  className={tab === 'atendimento' ? 'so-tab active' : 'so-tab'}
                  onClick={() => setTab('atendimento')}
                >
                  <Stethoscope size={16} /> Atendimento
                </button>
              </div>
            </header>

            {/* Corpo */}
            <div className="so-body scroll-y">
              {tab === 'detalhes' ? (
                <DetailsTab
                  apt={apt}
                  procs={procs}
                  total={total}
                  onStatus={(s) => updateAppointment(apt.id, { status: s })}
                />
              ) : (
                <div className="exec">
                  <SectionTitle
                    icon={<ClipboardList size={16} />}
                    title="Anamnese"
                    hint="Histórico e avaliação inicial"
                  />
                  <Anamnesis value={anamnesis} onChange={setAnamnesis} />

                  <SectionTitle
                    icon={<Stethoscope size={16} />}
                    title="Odontograma"
                    hint={`${doneTeeth.length}/${plannedTeeth.length} dentes concluídos`}
                  />
                  <Odontogram
                    marks={marks}
                    procedures={procs}
                    onChange={setMarks}
                  />

                  <SectionTitle
                    icon={<Pencil size={16} />}
                    title="Evolução do atendimento"
                  />
                  <textarea
                    className="textarea"
                    style={{ minHeight: 90 }}
                    placeholder="Descreva o que foi realizado, condutas e recomendações…"
                    value={execNotes}
                    onChange={(e) => setExecNotes(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Rodapé de ação */}
            <footer className="so-foot">
              {apt.status !== 'em_atendimento' && apt.status !== 'concluido' && (
                <button className="btn btn-primary so-cta" onClick={startService}>
                  <Stethoscope size={17} /> Iniciar atendimento
                </button>
              )}
              {apt.status === 'em_atendimento' && (
                <button className="btn btn-primary so-cta" onClick={finishService}>
                  <CheckCircle2 size={17} /> Concluir atendimento
                </button>
              )}
              {apt.status === 'concluido' && (
                <div className="so-done">
                  <CheckCircle2 size={18} /> Atendimento concluído
                </div>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function SectionTitle({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode
  title: string
  hint?: string
}) {
  return (
    <div className="sec-title">
      <span className="sec-icon">{icon}</span>
      <h4>{title}</h4>
      {hint && <span className="sec-hint">{hint}</span>}
    </div>
  )
}

function DetailsTab({
  apt,
  procs,
  total,
  onStatus,
}: {
  apt: Appointment
  procs: Procedure[]
  total: number
  onStatus: (s: AppointmentStatus) => void
}) {
  return (
    <div className="details">
      <SectionTitle icon={<ClipboardList size={16} />} title="Procedimentos" />
      <div className="proc-list">
        {procs.map((p) => (
          <div key={p.id} className="proc-item">
            <span className="dot" style={{ background: p.color }} />
            <div className="proc-item-main">
              <strong>{p.name}</strong>
              <span className="muted">
                {p.category} · {durationLabel(p.durationMin)}
              </span>
            </div>
            <span className="proc-item-price">{currency(p.price)}</span>
          </div>
        ))}
      </div>
      <div className="proc-total">
        <span>Total</span>
        <strong>{currency(total)}</strong>
      </div>

      {apt.notes && (
        <>
          <SectionTitle icon={<Pencil size={16} />} title="Observações" />
          <p className="note-box">{apt.notes}</p>
        </>
      )}

      <SectionTitle icon={<Clock size={16} />} title="Status" />
      <div className="status-pick">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`status-opt ${apt.status === s ? 'active' : ''}`}
            style={
              apt.status === s
                ? {
                    background: STATUS_META[s].bg,
                    color: STATUS_META[s].color,
                    borderColor: STATUS_META[s].color,
                  }
                : undefined
            }
            onClick={() => onStatus(s)}
          >
            <span className="dot" style={{ background: STATUS_META[s].color }} />
            {STATUS_META[s].label}
          </button>
        ))}
      </div>
    </div>
  )
}
