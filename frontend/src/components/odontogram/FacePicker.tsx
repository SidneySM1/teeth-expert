import type { ToothFace } from '@/types'
import { Tip } from '@/components/ui/Tooltip'

const FACES: { key: ToothFace; label: string; full: string }[] = [
  { key: 'vestibular', label: 'V', full: 'Vestibular' },
  { key: 'distal', label: 'D', full: 'Distal' },
  { key: 'oclusal', label: 'O', full: 'Oclusal' },
  { key: 'mesial', label: 'M', full: 'Mesial' },
  { key: 'lingual', label: 'L', full: 'Lingual' },
]

/**
 * Seletor das 5 faces do dente em formato de "tabuleiro" clássico:
 *   ┌───────────┐
 *   │     V     │
 *   ├───┬───┬───┤
 *   │ D │ O │ M │
 *   ├───┴───┴───┤
 *   │     L     │
 *   └───────────┘
 */
export function FacePicker({
  value,
  color,
  onChange,
}: {
  value: ToothFace[]
  color: string
  onChange: (faces: ToothFace[]) => void
}) {
  const toggle = (f: ToothFace) =>
    onChange(value.includes(f) ? value.filter((x) => x !== f) : [...value, f])

  const cell = (f: ToothFace, style: React.CSSProperties) => {
    const active = value.includes(f)
    const meta = FACES.find((x) => x.key === f)!
    return (
      <Tip key={f} label={meta.full}>
        <button
          type="button"
          onClick={() => toggle(f)}
          className="face-cell"
          style={{
            ...style,
            background: active ? color : 'var(--surface)',
            color: active ? '#fff' : 'var(--text-mute)',
          }}
        >
          {meta.label}
        </button>
      </Tip>
    )
  }

  return (
    <div className="face-grid">
      {cell('vestibular', { gridArea: 'v' })}
      {cell('distal', { gridArea: 'd' })}
      {cell('oclusal', { gridArea: 'o' })}
      {cell('mesial', { gridArea: 'm' })}
      {cell('lingual', { gridArea: 'l' })}
    </div>
  )
}
