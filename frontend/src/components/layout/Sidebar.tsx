import { CalendarDays, RotateCcw, Stethoscope, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useClinic } from '@/store/ClinicContext'
import './layout.css'

const NAV = [
  { to: '/', label: 'Agenda', icon: CalendarDays, end: true },
  { to: '/pacientes', label: 'Pacientes', icon: Users, end: false },
  { to: '/procedimentos', label: 'Procedimentos', icon: Stethoscope, end: false },
]

export function Sidebar() {
  const { resetDemo, appointments } = useClinic()
  const today = appointments.filter(
    (a) => new Date(a.start).toDateString() === new Date().toDateString(),
  ).length

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 2.5c-2 0-3.2 1-5 1S3.5 2.5 3.5 6c0 2.4.7 4 1.4 6.6.5 1.9.6 4 .9 5.6.3 1.6.7 3.3 1.8 3.3 1.3 0 1.3-2.2 1.6-3.9.2-1.3.4-2.7 1.3-2.7s1.1 1.4 1.3 2.7c.3 1.7.3 3.9 1.6 3.9 1.1 0 1.5-1.7 1.8-3.3.3-1.6.4-3.7.9-5.6C18.8 10 19.5 8.4 19.5 6c0-3.5-1.7-2.5-3.5-2.5s-2-1-4-1Z" />
          </svg>
        </span>
        <div>
          <strong>Teeth Expert</strong>
          <span>Gestão clínica</span>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <n.icon size={19} />
            <span>{n.label}</span>
            {n.to === '/' && today > 0 && <span className="nav-badge">{today}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="demo-card">
          <p>Modo demonstração</p>
          <span>Os dados ficam salvos no seu navegador.</span>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (confirm('Restaurar os dados de exemplo? As alterações serão perdidas.'))
                resetDemo()
            }}
          >
            <RotateCcw size={15} /> Restaurar demo
          </button>
        </div>
      </div>
    </aside>
  )
}
