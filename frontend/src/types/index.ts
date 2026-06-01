// ---------------------------------------------------------------------------
// Domínio da clínica odontológica
// ---------------------------------------------------------------------------

export interface Patient {
  id: string
  name: string
  phone: string
  email?: string
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

// --------------------------- Pagamento ---------------------------
export type PaymentMethod =
  | 'dinheiro'
  | 'pix'
  | 'credito'
  | 'debito'
  | 'transferencia'

/** Status derivado do total x valor pago (pode ser sobrescrito para "estornado"). */
export type PaymentStatus = 'pendente' | 'parcial' | 'pago' | 'estornado'

export interface Payment {
  id: string
  amount: number
  method: PaymentMethod
  /** data/hora do pagamento (ISO) */
  date: string
  note?: string
}

/** Item efetivamente realizado no atendimento (o valor é definido aqui). */
export interface TreatmentItem {
  id: string
  procedureId: string
  /** dente associado (FDI), opcional */
  tooth?: number
  /** preço cobrado — editável pelo dentista */
  price: number
  note?: string
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
  // itens realizados (definidos durante a execução)
  treatmentItems?: TreatmentItem[]
  // pagamento
  discount?: number
  payments?: Payment[]
  /** sobrescreve o status derivado (ex.: "estornado") */
  paymentStatusOverride?: PaymentStatus
}

// Tipos auxiliares de visão de calendário
export type CalendarMode = 'month' | 'week' | 'day'
