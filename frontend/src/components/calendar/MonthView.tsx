import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { motion } from 'framer-motion'
import type { Appointment } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { STATUS_META, hhmm } from '@/lib/format'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function MonthView({
  cursor,
  appointments,
  onSelect,
  onDayClick,
}: {
  cursor: Date
  appointments: Appointment[]
  onSelect: (apt: Appointment) => void
  onDayClick: (d: Date) => void
}) {
  const { patientById } = useClinic()
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start, end })

  const byDay = (d: Date) =>
    appointments
      .filter((a) => isSameDay(new Date(a.start), d))
      .sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div className="cal-month">
      <div className="cal-weekdays">
        {WEEKDAYS.map((w) => (
          <div key={w} className="cal-weekday">
            {w}
          </div>
        ))}
      </div>
      <div className="cal-grid">
        {days.map((d) => {
          const items = byDay(d)
          const inMonth = isSameMonth(d, cursor)
          return (
            <div
              key={d.toISOString()}
              className={`cal-cell ${inMonth ? '' : 'is-out'} ${
                isToday(d) ? 'is-today' : ''
              }`}
              onClick={() => onDayClick(d)}
            >
              <div className="cal-cell-head">
                <span className="cal-daynum">{d.getDate()}</span>
                {items.length > 0 && (
                  <span className="cal-count">{items.length}</span>
                )}
              </div>
              <div className="cal-cell-events">
                {items.slice(0, 3).map((a) => {
                  const m = STATUS_META[a.status]
                  const pat = patientById(a.patientId)
                  return (
                    <motion.button
                      key={a.id}
                      className="cal-event"
                      style={{ background: m.bg, color: m.color }}
                      whileHover={{ x: 2 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(a)
                      }}
                    >
                      <span className="cal-event-time">{hhmm(a.start)}</span>
                      <span className="cal-event-name">{pat?.name ?? '—'}</span>
                    </motion.button>
                  )
                })}
                {items.length > 3 && (
                  <span className="cal-more">+{items.length - 3} mais</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
