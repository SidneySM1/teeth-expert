import type { AnamnesisAnswers } from '@/types'

const EMPTY: AnamnesisAnswers = {
  motivo: '',
  alergias: '',
  medicamentos: '',
  doencas: '',
  fumante: false,
  gestante: false,
  pressaoAlta: false,
  diabetes: false,
  observacoes: '',
}

const TOGGLES: { key: keyof AnamnesisAnswers; label: string }[] = [
  { key: 'fumante', label: 'Fumante' },
  { key: 'gestante', label: 'Gestante' },
  { key: 'pressaoAlta', label: 'Pressão alta' },
  { key: 'diabetes', label: 'Diabetes' },
]

export function Anamnesis({
  value,
  onChange,
}: {
  value?: AnamnesisAnswers
  onChange: (v: AnamnesisAnswers) => void
}) {
  const v = value ?? EMPTY
  const set = (patch: Partial<AnamnesisAnswers>) => onChange({ ...v, ...patch })

  return (
    <div className="anamnese">
      <div className="field">
        <label>Queixa principal / motivo da consulta</label>
        <textarea
          className="textarea"
          value={v.motivo}
          onChange={(e) => set({ motivo: e.target.value })}
          placeholder="Ex.: dor no dente posterior ao mastigar…"
        />
      </div>

      <div className="anamnese-grid">
        <div className="field">
          <label>Alergias</label>
          <input
            className="input"
            value={v.alergias}
            onChange={(e) => set({ alergias: e.target.value })}
            placeholder="Ex.: penicilina"
          />
        </div>
        <div className="field">
          <label>Medicamentos em uso</label>
          <input
            className="input"
            value={v.medicamentos}
            onChange={(e) => set({ medicamentos: e.target.value })}
            placeholder="Ex.: losartana"
          />
        </div>
      </div>

      <div className="field">
        <label>Doenças / condições relevantes</label>
        <input
          className="input"
          value={v.doencas}
          onChange={(e) => set({ doencas: e.target.value })}
          placeholder="Histórico médico relevante"
        />
      </div>

      <div className="field">
        <label>Marcadores rápidos</label>
        <div className="toggle-row">
          {TOGGLES.map((t) => {
            const active = v[t.key] as boolean
            return (
              <button
                key={t.key}
                type="button"
                className={`toggle-pill ${active ? 'active' : ''}`}
                onClick={() => set({ [t.key]: !active } as Partial<AnamnesisAnswers>)}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="field">
        <label>Observações da anamnese</label>
        <textarea
          className="textarea"
          value={v.observacoes}
          onChange={(e) => set({ observacoes: e.target.value })}
        />
      </div>
    </div>
  )
}
