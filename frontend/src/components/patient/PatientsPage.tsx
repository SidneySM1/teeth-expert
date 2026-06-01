import { motion } from 'framer-motion'
import { ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useClinic } from '@/store/ClinicContext'
import { Avatar } from '@/components/ui/Avatar'
import { currency } from '@/lib/format'
import { paymentSummary } from '@/lib/payments'
import { PatientProfile } from './PatientProfile'
import './patients.css'

export function PatientsPage() {
  const { patients, appointments, procedures } = useClinic()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return patients
      .map((p) => {
        const appts = appointments.filter((a) => a.patientId === p.id)
        const balance = appts.reduce(
          (s, a) => s + paymentSummary(a, procedures).balance,
          0,
        )
        const last = appts
          .map((a) => a.start)
          .sort((a, b) => b.localeCompare(a))[0]
        return { patient: p, count: appts.length, balance, last }
      })
      .filter(
        (r) =>
          !q ||
          r.patient.name.toLowerCase().includes(q) ||
          r.patient.phone.includes(q),
      )
      .sort((a, b) => a.patient.name.localeCompare(b.patient.name))
  }, [patients, appointments, procedures, query])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-sub">
            {patients.length} cadastrados · clique para ver o prontuário
          </p>
        </div>
        <div className="pt-search">
          <Search size={16} />
          <input
            placeholder="Buscar por nome ou telefone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="pt-grid">
        {rows.map((r, i) => (
          <motion.button
            key={r.patient.id}
            className="pt-card card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -3 }}
            onClick={() => setSelected(r.patient.id)}
          >
            <Avatar name={r.patient.name} size={46} />
            <div className="pt-card-main">
              <strong>{r.patient.name}</strong>
              <span className="muted">{r.patient.phone}</span>
            </div>
            <div className="pt-card-meta">
              <span className="pt-count">{r.count} consulta(s)</span>
              {r.last && (
                <span className="muted pt-last">
                  últ. {format(new Date(r.last), 'd MMM yy', { locale: ptBR })}
                </span>
              )}
              {r.balance > 0 && (
                <span className="pt-balance">{currency(r.balance)} em aberto</span>
              )}
            </div>
            <ChevronRight size={18} className="pt-chev" />
          </motion.button>
        ))}
        {rows.length === 0 && (
          <p className="profile-empty" style={{ gridColumn: '1 / -1' }}>
            Nenhum paciente encontrado.
          </p>
        )}
      </div>

      <PatientProfile patientId={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
