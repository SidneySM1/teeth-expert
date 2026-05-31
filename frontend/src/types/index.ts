// ---------------------------------------------------------------------------
// Domínio da clínica odontológica
// ---------------------------------------------------------------------------

export interface Patient {
  id: string
  name: string
  phone: string
  birthDate?: string // ISO date
  notes?: string
}

export interface Procedure {
  id: string
  name: string
  /** categoria livre: Preventivo, Restaurador, Endodontia, Estético... */
  category: string
  /** duração padrão em minutos */
  durationMin: number
  price: number
  color: string // cor de destaque (hex)
  description?: string
}

export type AppointmentStatus =
  | 'agendado'
  | 'confirmado'
  | 'em_atendimento'
  | 'concluido'
  | 'cancelado'

/** Faces do dente para marcação no odontograma */
export type ToothFace = 'oclusal' | 'mesial' | 'distal' | 'vestibular' | 'lingual'

/** Condição clínica de um dente individual */
export type ToothCondition =
  | 'saudavel'
  | 'cariado'
  | 'restaurado'
  | 'ausente'
  | 'tratamento'
  | 'implante'

export interface ToothMark {
  /** número FDI do dente (11-48) */
  tooth: number
  condition: ToothCondition
  faces: ToothFace[]
  /** procedimento planejado para o dente (id) */
  procedureId?: string
  done: boolean
  note?: string
}

export interface AnamnesisAnswers {
  motivo: string
  alergias: string
  medicamentos: string
  doencas: string
  fumante: boolean
  gestante: boolean
  pressaoAlta: boolean
  diabetes: boolean
  observacoes: string
}

export interface Appointment {
  id: string
  patientId: string
  procedureIds: string[]
  /** início ISO datetime */
  start: string
  /** fim ISO datetime */
  end: string
  status: AppointmentStatus
  notes?: string
  // dados de execução (preenchidos no atendimento)
  anamnesis?: AnamnesisAnswers
  toothMarks?: ToothMark[]
  executionNotes?: string
}

// Tipos auxiliares de visão de calendário
export type CalendarMode = 'month' | 'week' | 'day'
