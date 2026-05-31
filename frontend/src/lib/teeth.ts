// Numeração FDI dos dentes permanentes, organizada por quadrantes.
// Quadrante 1: superior direito (18-11), 2: superior esquerdo (21-28)
// Quadrante 4: inferior direito (48-41), 3: inferior esquerdo (31-38)

export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28]
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]
export const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38]

export const UPPER_ROW = [...UPPER_RIGHT, ...UPPER_LEFT]
export const LOWER_ROW = [...LOWER_RIGHT, ...LOWER_LEFT]

export const ALL_TEETH = [...UPPER_ROW, ...LOWER_ROW]

/** Tipo do dente, para desenhar o ícone com formato apropriado. */
export type ToothKind = 'molar' | 'premolar' | 'canine' | 'incisor'

export function toothKind(n: number): ToothKind {
  const pos = n % 10 // 1..8 a partir da linha média
  if (pos <= 2) return 'incisor'
  if (pos === 3) return 'canine'
  if (pos <= 5) return 'premolar'
  return 'molar'
}
