import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  isToday,
  startOfWeek,
} from 'date-fns'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Appointment } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { STATUS_META, hhmm } from '@/lib/format'

const START_HOUR = 7
const END_HOUR = 20
const HOUR_PX = 60

export function TimeGridView({
  cursor,
  mode,
  appointments,
  onSelect,
  onSlotClick,
}: {
  cursor: Date
  mode: 'week' | 'day'
  appointments: Appointment[]
  onSelect: (apt: Appointment) => void
  onSlotClick: (d: Date) => void
}) {
  const { patientById } = useClinic()
  const days = useMemo(() => {
    if (mode === 'day') return [cursor]
    const start = startOfWeek(cursor, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end: endOfWeek(cursor, { weekStartsOn: 0 }) })
  }, [cursor, mode])

  const hours = useMemo(() => {
    const arr: number[] = []
    for (let h = START_HOUR; h <= END_HOUR; h++) arr.push(h)
    return arr
  }, [])

  const dayEvents = (d: Date) =>
    appointments.filter((a) => isSameDay(new Date(a.start), d))

  function posFor(a: Appointment) {
    const s = new Date(a.start)
    const e = new Date(a.end)
    const top = (s.getHours() - START_HOUR + s.getMinutes() / 60) * HOUR_PX
    const dur = Math.max(
      24,
      ((e.getTime() - s.getTime()) / 3600000) * HOUR_PX,
    )
    return { top, height: dur }
  }

  return (
    <div className="cal-time">
      <div
        className="cal-time-head"
        style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
      >
        <div className="cal-gutter" />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className={`cal-dayhead ${isToday(d) ? 'is-today' : ''}`}
          >
            <span className="cal-dayhead-dow">
              {format(d, 'EEE', { locale: ptBR })}
            </span>
            <span className="cal-dayhead-num">{d.getDate()}</span>
          </div>
        ))}
      </div>

      <div className="cal-time-body scroll-y">
        <div
          className="cal-time-grid"
          style={{
            gridTemplateColumns: `56px repeat(${days.length}, 1fr)`,
            height: (END_HOUR - START_HOUR + 1) * HOUR_PX,
          }}
        >
          {/* gutter de horas */}
          <div className="cal-hours">
            {hours.map((h) => (
              <div key={h} className="cal-hour" style={{ height: HOUR_PX }}>
                <span>{String(h).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>

          {/* colunas de dias */}
          {days.map((d) => (
            <div key={d.toISOString()} className="cal-daycol">
              {hours.map((h) => (
                <div
                  key={h}
                  className="cal-slot"
                  style={{ height: HOUR_PX }}
                  onClick={() => {
                    const slot = new Date(d)
                    slot.setHours(h, 0, 0, 0)
                    onSlotClick(slot)
                  }}
                />
              ))}
              {dayEvents(d).map((a) => {
                const { top, height } = posFor(a)
                const m = STATUS_META[a.status]
                const pat = patientById(a.patientId)
                return (
                  <motion.button
                    key={a.id}
                    className="cal-tevent"
                    style={{
                      top,
                      height,
                      background: m.bg,
                      borderColor: m.color,
                      color: m.color,
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02, zIndex: 5 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(a)
                    }}
                  >
                    <span className="cal-tevent-time">
                      {hhmm(a.start)}–{hhmm(a.end)}
                    </span>
                    <span className="cal-tevent-name">{pat?.name ?? '—'}</span>
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { START_HOUR, addDays }
