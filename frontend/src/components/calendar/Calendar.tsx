import { addDays, addMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Appointment, CalendarMode } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { MonthView } from './MonthView'
import { TimeGridView } from './TimeGridView'
import { AppointmentForm } from '@/components/appointment/AppointmentForm'
import { AppointmentSlideout } from '@/components/appointment/AppointmentSlideout'
import { PatientProfile } from '@/components/patient/PatientProfile'
import { Tip } from '@/components/ui/Tooltip'
import './calendar.css'

const MODES: { key: CalendarMode; label: string }[] = [
  { key: 'month', label: 'Mês' },
  { key: 'week', label: 'Semana' },
  { key: 'day', label: 'Dia' },
]

export function Calendar() {
  const { appointments } = useClinic()
  const isMobile = useMediaQuery('(max-width: 720px)')
  const [mode, setMode] = useState<CalendarMode>(() =>
    typeof window !== 'undefined' && window.innerWidth <= 720 ? 'day' : 'week',
  )
  const [cursor, setCursor] = useState(new Date())

  // No mobile a visão de semana fica apertada — recai para "dia".
  useEffect(() => {
    if (isMobile && mode === 'week') setMode('day')
  }, [isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  const [selected, setSelected] = useState<Appointment | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formDate, setFormDate] = useState<Date | undefined>()
  const [editing, setEditing] = useState<Appointment | undefined>()
  const [profileId, setProfileId] = useState<string | null>(null)

  // mantém o slideout sincronizado com o store após edições
  const liveSelected = selected
    ? appointments.find((a) => a.id === selected.id) ?? null
    : null

  function shift(dir: 1 | -1) {
    if (mode === 'month') setCursor((c) => addMonths(c, dir))
    else if (mode === 'week') setCursor((c) => addDays(c, dir * 7))
    else setCursor((c) => addDays(c, dir))
  }

  function openNew(date?: Date) {
    setEditing(undefined)
    setFormDate(date)
    setFormOpen(true)
  }
  function openEdit(apt: Appointment) {
    setEditing(apt)
    setFormDate(undefined)
    setFormOpen(true)
  }

  const title =
    mode === 'month'
      ? format(cursor, "MMMM 'de' yyyy", { locale: ptBR })
      : mode === 'day'
        ? format(cursor, "d 'de' MMMM, yyyy", { locale: ptBR })
        : `${format(cursor, "d MMM", { locale: ptBR })} — semana`

  return (
    <div className="calendar">
      <header className="cal-header">
        <div className="cal-header-left">
          <h2 className="cal-title">{title}</h2>
          <div className="cal-nav">
            <Tip label="Anterior">
              <button className="btn btn-icon btn-ghost" onClick={() => shift(-1)}>
                <ChevronLeft size={18} />
              </button>
            </Tip>
            <button
              className="btn btn-ghost cal-today"
              onClick={() => setCursor(new Date())}
            >
              Hoje
            </button>
            <Tip label="Próximo">
              <button className="btn btn-icon btn-ghost" onClick={() => shift(1)}>
                <ChevronRight size={18} />
              </button>
            </Tip>
          </div>
        </div>

        <div className="cal-header-right">
          <div className="cal-modes">
            {MODES.map((m) => (
              <button
                key={m.key}
                className={`cal-mode ${mode === m.key ? 'active' : ''}`}
                onClick={() => setMode(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary cal-add"
            onClick={() => openNew()}
          >
            <Plus size={17} /> <span className="cal-add-label">Agendar</span>
          </button>
        </div>
      </header>

      <div className="cal-stage">
        {mode === 'month' ? (
          <MonthView
            cursor={cursor}
            appointments={appointments}
            onSelect={setSelected}
            onDayClick={(d) => {
              setCursor(d)
              setMode('day')
            }}
          />
        ) : (
          <TimeGridView
            cursor={cursor}
            mode={mode}
            appointments={appointments}
            onSelect={setSelected}
            onSlotClick={openNew}
          />
        )}
      </div>

      <AppointmentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialDate={formDate}
        editing={editing}
      />

      <AppointmentSlideout
        appointment={liveSelected}
        onClose={() => setSelected(null)}
        onEdit={(apt) => {
          setSelected(null)
          openEdit(apt)
        }}
        onOpenPatient={(id) => setProfileId(id)}
      />

      <PatientProfile
        patientId={profileId}
        onClose={() => setProfileId(null)}
        onOpenAppointment={(apt) => {
          setProfileId(null)
          setSelected(apt)
        }}
      />
    </div>
  )
}
