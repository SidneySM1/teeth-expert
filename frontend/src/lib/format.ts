import type { AppointmentStatus, ToothCondition } from '@/types'

export const STATUS_META: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string }
> = {
  agendado: { label: 'Agendado', color: '#4f46e5', bg: '#eef0fe' },
  confirmado: { label: 'Confirmado', color: '#0b8a99', bg: '#d9f4f7' },
  em_atendimento: { label: 'Em atendimento', color: '#b45309', bg: '#fef0d9' },
  concluido: { label: 'Concluído', color: '#15803d', bg: '#dcfce7' },
  cancelado: { label: 'Cancelado', color: '#dc2626', bg: '#fee2e2' },
}

export const CONDITION_META: Record<
  ToothCondition,
  { label: string; color: string }
> = {
  saudavel: { label: 'Saudável', color: '#cbd5e1' },
  cariado: { label: 'Cárie', color: '#ef4444' },
  restaurado: { label: 'Restaurado', color: '#6366f1' },
  ausente: { label: 'Ausente', color: '#94a3b8' },
  tratamento: { label: 'Em tratamento', color: '#f59e0b' },
  implante: { label: 'Implante', color: '#0ea5b7' },
}

export const currency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Cor de avatar determinística a partir do nome
const AVATAR_COLORS = [
  '#0ea5b7',
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ef4444',
]
export function avatarColor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const hhmm = (iso: string) => {
  const d = new Date(iso)
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function durationLabel(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h${pad2(m)}` : `${h}h`
}
