import { useMemo, useState } from 'react'
import { CalendarClock, Plus, UserPlus } from 'lucide-react'
import type { Appointment, AppointmentStatus } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { durationLabel, pad2 } from '@/lib/format'
import { STATUS_META } from '@/lib/format'

interface Props {
  open: boolean
  onClose: () => void
  /** data inicial sugerida (ISO) ao abrir a partir do calendário */
  initialDate?: Date
  /** consulta a editar (se houver) */
  editing?: Appointment
}

const STATUSES: AppointmentStatus[] = [
  'agendado',
  'confirmado',
  'em_atendimento',
  'concluido',
  'cancelado',
]

function toDateInput(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function toTimeInput(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function AppointmentForm({ open, onClose, initialDate, editing }: Props) {
  const { patients, procedures, addPatient, addAppointment, updateAppointment } =
    useClinic()

  const base = editing ? new Date(editing.start) : initialDate ?? new Date()

  const [patientId, setPatientId] = useState(editing?.patientId ?? '')
  const [newPatient, setNewPatient] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [procIds, setProcIds] = useState<string[]>(editing?.procedureIds ?? [])
  const [date, setDate] = useState(toDateInput(base))
  const [time, setTime] = useState(toTimeInput(base))
  const [status, setStatus] = useState<AppointmentStatus>(
    editing?.status ?? 'agendado',
  )
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [error, setError] = useState('')

  const totalMin = useMemo(
    () =>
      procIds.reduce(
        (s, id) => s + (procedures.find((p) => p.id === id)?.durationMin ?? 0),
        0,
      ) || 30,
    [procIds, procedures],
  )
  function toggleProc(id: string) {
    setProcIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  function submit() {
    setError('')
    let pid = patientId
    if (newPatient) {
      if (!newName.trim()) return setError('Informe o nome do paciente.')
      pid = addPatient({
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || undefined,
      }).id
    }
    if (!pid) return setError('Selecione um paciente.')
    if (procIds.length === 0) return setError('Selecione ao menos um procedimento.')

    const start = new Date(`${date}T${time}`)
    const end = new Date(start.getTime() + totalMin * 60000)
    const payload = {
      patientId: pid,
      procedureIds: procIds,
      start: start.toISOString(),
      end: end.toISOString(),
      status,
      notes: notes.trim() || undefined,
    }
    if (editing) updateAppointment(editing.id, payload)
    else addAppointment(payload)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={580}
      title={editing ? 'Editar consulta' : 'Agendar consulta'}
      subtitle={
        <span className="row" style={{ gap: 6 }}>
          <CalendarClock size={14} />
          Preencha os dados do atendimento
        </span>
      }
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={submit}>
            {editing ? 'Salvar alterações' : 'Agendar'}
          </button>
        </>
      }
    >
      <div className="form-stack">
        {/* Paciente */}
        <div className="field">
          <label>Paciente</label>
          {!newPatient ? (
            <div className="row" style={{ gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Select
                  value={patientId}
                  onChange={setPatientId}
                  ariaLabel="Paciente"
                  placeholder="Selecione…"
                  options={patients.map((p) => ({
                    value: p.id,
                    label: p.name,
                    hint: p.phone,
                  }))}
                />
              </div>
              <button
                className="btn btn-soft"
                type="button"
                onClick={() => setNewPatient(true)}
              >
                <UserPlus size={16} /> Novo
              </button>
            </div>
          ) : (
            <div className="new-patient">
              <input
                className="input np-name"
                placeholder="Nome completo"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <input
                className="input"
                placeholder="Telefone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <input
                className="input"
                type="email"
                placeholder="E-mail (opcional)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                className="btn btn-ghost np-use"
                type="button"
                onClick={() => setNewPatient(false)}
              >
                Usar existente
              </button>
            </div>
          )}
        </div>

        {/* Procedimentos */}
        <div className="field">
          <label>Procedimentos</label>
          <div className="proc-pick">
            {procedures.map((p) => {
              const active = procIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`proc-chip ${active ? 'active' : ''}`}
                  style={
                    active
                      ? { borderColor: p.color, background: `${p.color}14` }
                      : undefined
                  }
                  onClick={() => toggleProc(p.id)}
                >
                  <span className="dot" style={{ background: p.color }} />
                  <span className="proc-chip-name">{p.name}</span>
                  <span className="proc-chip-meta">{durationLabel(p.durationMin)}</span>
                  {active && <Plus size={14} className="proc-chip-add" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Data / hora */}
        <div className="form-row">
          <div className="field">
            <label>Data</label>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Início</label>
            <input
              className="input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <Select
              value={status}
              onChange={(v) => setStatus(v as AppointmentStatus)}
              ariaLabel="Status"
              options={STATUSES.map((s) => ({
                value: s,
                label: STATUS_META[s].label,
                color: STATUS_META[s].color,
              }))}
            />
          </div>
        </div>

        <div className="field">
          <label>Observações</label>
          <textarea
            className="textarea"
            placeholder="Alguma informação relevante para a recepção…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="form-summary">
          <div>
            <span className="muted">Duração estimada</span>
            <strong>{durationLabel(totalMin)}</strong>
          </div>
          <div className="form-summary-note">
            <span className="muted">
              Os valores são definidos no atendimento, ao registrar os
              procedimentos realizados.
            </span>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
      </div>
    </Modal>
  )
}
