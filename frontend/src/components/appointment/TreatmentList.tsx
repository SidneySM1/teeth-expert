import { motion } from 'framer-motion'
import { Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Appointment, Procedure, ToothMark } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Select } from '@/components/ui/Select'
import { Tip } from '@/components/ui/Tooltip'
import { currency } from '@/lib/format'
import './treatment.css'

const NONE = '__none__'

export function TreatmentList({
  apt,
  procedures,
  marks,
}: {
  apt: Appointment
  procedures: Procedure[]
  marks: ToothMark[]
}) {
  const { addTreatmentItem, updateTreatmentItem, removeTreatmentItem } = useClinic()
  const items = apt.treatmentItems ?? []
  const [procId, setProcId] = useState('')
  const [tooth, setTooth] = useState(NONE)

  const subtotal = items.reduce((s, it) => s + (it.price || 0), 0)
  const procOf = (id: string) => procedures.find((p) => p.id === id)

  // dentes marcados disponíveis para vincular
  const markedTeeth = marks.map((m) => m.tooth).sort((a, b) => a - b)

  // sugestões do odontograma ainda não lançadas
  const pending = marks.filter(
    (m) =>
      m.procedureId &&
      !items.some((it) => it.tooth === m.tooth && it.procedureId === m.procedureId),
  )

  function addItem() {
    if (!procId) return
    const p = procOf(procId)
    addTreatmentItem(apt.id, {
      procedureId: procId,
      tooth: tooth === NONE ? undefined : Number(tooth),
      price: p?.price ?? 0,
    })
    setProcId('')
    setTooth(NONE)
  }

  function importFromOdontogram() {
    pending.forEach((m) => {
      const p = procOf(m.procedureId!)
      addTreatmentItem(apt.id, {
        procedureId: m.procedureId!,
        tooth: m.tooth,
        price: p?.price ?? 0,
      })
    })
  }

  return (
    <div className="tl">
      {pending.length > 0 && (
        <button className="tl-import" onClick={importFromOdontogram}>
          <Sparkles size={15} />
          Adicionar {pending.length}{' '}
          {pending.length === 1 ? 'procedimento' : 'procedimentos'} do odontograma
        </button>
      )}

      {items.length > 0 && (
        <div className="tl-items">
          {items.map((it) => {
            const p = procOf(it.procedureId)
            return (
              <motion.div
                key={it.id}
                className="tl-item"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span
                  className="dot"
                  style={{ background: p?.color ?? 'var(--text-mute)' }}
                />
                <div className="tl-item-main">
                  <strong>{p?.name ?? 'Procedimento'}</strong>
                  {it.tooth != null && (
                    <span className="tl-tooth">dente {it.tooth}</span>
                  )}
                </div>
                <div className="tl-price">
                  <span className="tl-price-prefix">R$</span>
                  <input
                    className="tl-price-input"
                    type="number"
                    min={0}
                    step={10}
                    value={it.price}
                    onChange={(e) =>
                      updateTreatmentItem(apt.id, it.id, {
                        price: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <Tip label="Remover item">
                  <button
                    className="btn btn-icon btn-ghost tl-del"
                    onClick={() => removeTreatmentItem(apt.id, it.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </Tip>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Adicionar manualmente */}
      <div className="tl-add">
        <div className="tl-add-fields">
          <Select
            value={procId}
            onChange={setProcId}
            ariaLabel="Procedimento"
            placeholder="Adicionar procedimento…"
            options={procedures.map((p) => ({
              value: p.id,
              label: p.name,
              color: p.color,
              hint: currency(p.price),
            }))}
          />
          <Select
            value={tooth}
            onChange={setTooth}
            ariaLabel="Dente"
            options={[
              { value: NONE, label: 'Sem dente' },
              ...markedTeeth.map((t) => ({
                value: String(t),
                label: `Dente ${t}`,
              })),
            ]}
          />
        </div>
        <button className="btn btn-soft tl-add-btn" onClick={addItem} disabled={!procId}>
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {items.length > 0 && (
        <div className="tl-subtotal">
          <span>Subtotal do atendimento</span>
          <strong>{currency(subtotal)}</strong>
        </div>
      )}
    </div>
  )
}
