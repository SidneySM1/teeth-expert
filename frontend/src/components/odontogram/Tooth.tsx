import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ToothMark } from '@/types'
import { CONDITION_META } from '@/lib/format'
import { toothKind, type ToothKind } from '@/lib/teeth'
import { Tip } from '@/components/ui/Tooltip'

// Caminhos SVG estilizados por tipo de dente (coroa + raízes), viewBox 0 0 40 56
const CROWNS: Record<ToothKind, string> = {
  molar:
    'M7 18 C6 8 13 4 20 4 C27 4 34 8 33 18 C32.5 23 30 25 28 25 L12 25 C10 25 7.5 23 7 18 Z',
  premolar:
    'M9 18 C8 9 14 5 20 5 C26 5 32 9 31 18 C30.5 22.5 28 24 26 24 L14 24 C12 24 9.5 22.5 9 18 Z',
  canine:
    'M11 17 C10 8 16 4 20 4 C24 4 30 8 29 17 C28.5 21 26 23 24 23 L16 23 C14 23 11.5 21 11 17 Z',
  incisor:
    'M11 16 C10.5 8 15 5 20 5 C25 5 29.5 8 29 16 C28.7 20 26.5 22 24 22 L16 22 C13.5 22 11.3 20 11 16 Z',
}
const ROOTS: Record<ToothKind, string> = {
  molar:
    'M12 25 C11 36 9 44 10 50 M28 25 C29 36 31 44 30 50 M20 25 L20 49',
  premolar: 'M14 24 C13 35 12 44 13 51 M26 24 C27 35 28 44 27 51',
  canine: 'M16 23 C15 36 16 47 20 53 C24 47 25 36 24 23',
  incisor: 'M16 22 C15.5 34 17 46 20 52 C23 46 24.5 34 24 22',
}

interface Props {
  number: number
  mark?: ToothMark
  selected: boolean
  onSelect: () => void
  flip?: boolean // espelha verticalmente para a arcada inferior
}

export function Tooth({ number, mark, selected, onSelect, flip }: Props) {
  const kind = toothKind(number)
  const condition = mark?.condition ?? 'saudavel'
  const meta = CONDITION_META[condition]
  const isAbsent = condition === 'ausente'
  const hasProc = !!mark?.procedureId
  const crownFill = condition === 'saudavel' ? '#ffffff' : meta.color
  const stroke = condition === 'saudavel' ? '#c4d0de' : meta.color

  const tip = (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <strong>Dente {number}</strong>
      <span style={{ opacity: 0.85 }}>
        {meta.label}
        {mark?.faces?.length ? ` · faces ${mark.faces.length}` : ''}
        {mark?.done ? ' · concluído' : ''}
      </span>
    </span>
  )

  return (
    <Tip label={tip}>
      <button
        type="button"
        className={`tooth ${selected ? 'is-selected' : ''}`}
        onClick={onSelect}
      >
        <span className="tooth-num">{number}</span>
      <motion.span
        className="tooth-svg-wrap"
        whileHover={{ y: -3 }}
        animate={selected ? { scale: 1.08 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <svg
          viewBox="0 0 40 56"
          width="34"
          height="46"
          style={{
            transform: flip ? 'scaleY(-1)' : undefined,
            opacity: isAbsent ? 0.28 : 1,
          }}
        >
          <path
            d={ROOTS[kind]}
            fill="none"
            stroke={stroke}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <path
            d={CROWNS[kind]}
            fill={crownFill}
            stroke={stroke}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          {condition === 'restaurado' && (
            <circle cx="20" cy="15" r="4.5" fill="#fff" opacity={0.65} />
          )}
        </svg>
        {hasProc && !mark?.done && <span className="tooth-flag" />}
        {mark?.done && (
          <span className="tooth-check">
            <Check size={11} strokeWidth={3.5} />
          </span>
        )}
        {isAbsent && <span className="tooth-x">✕</span>}
      </motion.span>
      </button>
    </Tip>
  )
}
