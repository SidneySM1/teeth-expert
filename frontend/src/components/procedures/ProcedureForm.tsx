import { useState } from 'react'
import type { Procedure } from '@/types'
import { useClinic } from '@/store/ClinicContext'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'

const COLORS = [
  '#0ea5b7',
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
]
const CATEGORIES = [
  'Preventivo',
  'Restaurador',
  'Endodontia',
  'Estético',
  'Cirurgia',
  'Ortodontia',
  'Prótese',
]

export function ProcedureForm({
  open,
  onClose,
  editing,
}: {
  open: boolean
  onClose: () => void
  editing?: Procedure
}) {
  const { addProcedure, updateProcedure } = useClinic()
  const [name, setName] = useState(editing?.name ?? '')
  const [category, setCategory] = useState(editing?.category ?? 'Preventivo')
  const [durationMin, setDurationMin] = useState(editing?.durationMin ?? 30)
  const [price, setPrice] = useState(editing?.price ?? 0)
  const [color, setColor] = useState(editing?.color ?? COLORS[0])
  const [description, setDescription] = useState(editing?.description ?? '')
  const [error, setError] = useState('')

  function submit() {
    if (!name.trim()) return setError('Informe o nome do procedimento.')
    const payload = {
      name: name.trim(),
      category,
      durationMin: Number(durationMin) || 30,
      price: Number(price) || 0,
      color,
      description: description.trim() || undefined,
    }
    if (editing) updateProcedure(editing.id, payload)
    else addProcedure(payload)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={500}
      title={editing ? 'Editar procedimento' : 'Novo procedimento'}
      subtitle="Defina os dados do serviço oferecido"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={submit}>
            {editing ? 'Salvar' : 'Criar procedimento'}
          </button>
        </>
      }
    >
      <div className="form-stack">
        <div className="field">
          <label>Nome</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Extração simples"
            autoFocus
          />
        </div>
        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="field">
            <label>Categoria</label>
            <Select
              value={category}
              onChange={setCategory}
              ariaLabel="Categoria"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div className="field">
            <label>Duração (min)</label>
            <input
              className="input"
              type="number"
              min={10}
              step={5}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Preço (R$)</label>
            <input
              className="input"
              type="number"
              min={0}
              step={10}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="field">
          <label>Cor de identificação</label>
          <div className="color-row">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-dot ${color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="field">
          <label>Descrição</label>
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes do procedimento (opcional)"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
      </div>
    </Modal>
  )
}
