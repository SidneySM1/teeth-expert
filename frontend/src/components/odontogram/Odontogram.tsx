import { AnimatePresence, motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Procedure, ToothCondition, ToothFace, ToothMark } from '@/types'
import { CONDITION_META } from '@/lib/format'
import { LOWER_ROW, UPPER_ROW } from '@/lib/teeth'
import { Tooth } from './Tooth'
import { FacePicker } from './FacePicker'
import { Select } from '@/components/ui/Select'
import { Tip } from '@/components/ui/Tooltip'
import './odontogram.css'

const NONE = '__none__'

const CONDITIONS: ToothCondition[] = [
  'saudavel',
  'cariado',
  'restaurado',
  'tratamento',
  'ausente',
  'implante',
]

interface Props {
  marks: ToothMark[]
  procedures: Procedure[]
  onChange: (marks: ToothMark[]) => void
}

export function Odontogram({ marks, procedures, onChange }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const markOf = (n: number) => marks.find((m) => m.tooth === n)

  function upsert(n: number, patch: Partial<ToothMark>) {
    const existing = markOf(n)
    if (existing) {
      onChange(marks.map((m) => (m.tooth === n ? { ...m, ...patch } : m)))
    } else {
      onChange([
        ...marks,
        {
          tooth: n,
          condition: 'saudavel',
          faces: [],
          done: false,
          ...patch,
        },
      ])
    }
  }

  function removeMark(n: number) {
    onChange(marks.filter((m) => m.tooth !== n))
    setSelected(null)
  }

  // Marcação exibida no editor: usa a existente ou um rascunho padrão,
  // para que clicar em um dente ainda "limpo" já abra o painel de edição.
  const sel: ToothMark | undefined =
    selected != null
      ? markOf(selected) ?? {
          tooth: selected,
          condition: 'saudavel',
          faces: [],
          done: false,
        }
      : undefined
  const selColor =
    sel && sel.condition !== 'saudavel'
      ? CONDITION_META[sel.condition].color
      : 'var(--primary)'

  return (
    <div className="odonto">
      <div className="odonto-chart">
        <div className="arch">
          <span className="arch-label">Superior</span>
          <div className="tooth-row">
            {UPPER_ROW.map((n, i) => (
              <ToothSlot
                key={n}
                n={n}
                mark={markOf(n)}
                selected={selected === n}
                onSelect={() => setSelected(selected === n ? null : n)}
                gap={i === 7}
              />
            ))}
          </div>
        </div>
        <div className="arch">
          <div className="tooth-row">
            {LOWER_ROW.map((n, i) => (
              <ToothSlot
                key={n}
                n={n}
                mark={markOf(n)}
                selected={selected === n}
                onSelect={() => setSelected(selected === n ? null : n)}
                gap={i === 7}
                flip
              />
            ))}
          </div>
          <span className="arch-label">Inferior</span>
        </div>
      </div>

      <div className="odonto-legend">
        {CONDITIONS.map((c) => (
          <span key={c} className="legend-item">
            <span className="dot" style={{ background: CONDITION_META[c].color }} />
            {CONDITION_META[c].label}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && selected != null ? (
          <motion.div
            key={selected}
            className="tooth-editor card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="te-head">
              <div className="te-title">
                <span className="te-badge" style={{ background: selColor }}>
                  {selected}
                </span>
                <div>
                  <strong>Dente {selected}</strong>
                  <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
                    {CONDITION_META[sel.condition].label}
                  </p>
                </div>
              </div>
              <Tip label="Limpar marcação do dente">
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => removeMark(selected)}
                >
                  <Trash2 size={16} />
                </button>
              </Tip>
            </div>

            <div className="te-section">
              <label className="te-label">Condição</label>
              <div className="cond-grid">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`cond-pill ${sel.condition === c ? 'active' : ''}`}
                    style={
                      sel.condition === c
                        ? {
                            background: CONDITION_META[c].color,
                            borderColor: CONDITION_META[c].color,
                            color: '#fff',
                          }
                        : undefined
                    }
                    onClick={() => upsert(selected, { condition: c })}
                  >
                    <span
                      className="dot"
                      style={{
                        background:
                          sel.condition === c ? '#fff' : CONDITION_META[c].color,
                      }}
                    />
                    {CONDITION_META[c].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="te-grid">
              <div className="te-section">
                <label className="te-label">Faces afetadas</label>
                <FacePicker
                  value={sel.faces}
                  color={selColor}
                  onChange={(faces: ToothFace[]) => upsert(selected, { faces })}
                />
              </div>

              <div className="te-section te-grow">
                <label className="te-label">Procedimento planejado</label>
                <Select
                  value={sel.procedureId ?? NONE}
                  onChange={(v) =>
                    upsert(selected, {
                      procedureId: v === NONE ? undefined : v,
                    })
                  }
                  ariaLabel="Procedimento planejado"
                  options={[
                    { value: NONE, label: '— Nenhum —' },
                    ...procedures.map((p) => ({
                      value: p.id,
                      label: p.name,
                      color: p.color,
                    })),
                  ]}
                />

                <label className="te-label" style={{ marginTop: 10 }}>
                  Observação
                </label>
                <input
                  className="input"
                  placeholder="Ex.: cárie profunda na distal"
                  value={sel.note ?? ''}
                  onChange={(e) => upsert(selected, { note: e.target.value })}
                />

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={sel.done}
                    onChange={(e) => upsert(selected, { done: e.target.checked })}
                  />
                  <span>Procedimento concluído neste dente</span>
                </label>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            className="odonto-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Clique em um dente para registrar condição, faces e procedimento.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToothSlot({
  n,
  mark,
  selected,
  onSelect,
  gap,
  flip,
}: {
  n: number
  mark?: ToothMark
  selected: boolean
  onSelect: () => void
  gap?: boolean
  flip?: boolean
}) {
  return (
    <div className={gap ? 'tooth-slot midline' : 'tooth-slot'}>
      <Tooth
        number={n}
        mark={mark}
        selected={selected}
        onSelect={onSelect}
        flip={flip}
      />
    </div>
  )
}
