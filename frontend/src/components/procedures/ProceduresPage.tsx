import { motion } from 'framer-motion'
import { Clock, Pencil, Plus, Stethoscope, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Procedure } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { currency, durationLabel } from '@/lib/format'
import { Tip } from '@/components/ui/Tooltip'
import { ProcedureForm } from './ProcedureForm'
import './procedures.css'

export function ProceduresPage() {
  const { procedures, removeProcedure } = useClinic()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Procedure | undefined>()

  function openNew() {
    setEditing(undefined)
    setOpen(true)
  }
  function openEdit(p: Procedure) {
    setEditing(p)
    setOpen(true)
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1 className="page-title">Procedimentos</h1>
          <p className="page-sub">
            Catálogo de serviços oferecidos pela clínica · {procedures.length} itens
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={17} /> Novo procedimento
        </button>
      </header>

      <div className="proc-cards">
        {procedures.map((p, i) => (
          <motion.div
            key={p.id}
            className="proc-card card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
          >
            <div className="proc-card-top" style={{ background: `${p.color}14` }}>
              <span className="proc-card-icon" style={{ background: p.color }}>
                <Stethoscope size={20} />
              </span>
              <span className="proc-card-cat" style={{ color: p.color }}>
                {p.category}
              </span>
              <div className="proc-card-actions">
                <Tip label="Editar procedimento">
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil size={15} />
                  </button>
                </Tip>
                <Tip label="Excluir procedimento">
                  <button
                    className="btn btn-icon btn-danger"
                    onClick={() => removeProcedure(p.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </Tip>
              </div>
            </div>
            <div className="proc-card-body">
              <h3>{p.name}</h3>
              {p.description && <p className="proc-card-desc">{p.description}</p>}
              <div className="proc-card-meta">
                <span className="muted">
                  <Clock size={14} /> {durationLabel(p.durationMin)}
                </span>
                <strong style={{ color: p.color }}>{currency(p.price)}</strong>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ProcedureForm open={open} onClose={() => setOpen(false)} editing={editing} />
    </div>
  )
}
