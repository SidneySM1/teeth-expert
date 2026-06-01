import type { Appointment, Patient, Procedure } from '@/types'

export const seedProcedures: Procedure[] = [
  {
    id: 'proc-limpeza',
    name: 'Limpeza / Profilaxia',
    category: 'Preventivo',
    durationMin: 40,
    price: 180,
    color: '#0ea5b7',
    description: 'Remoção de placa, tártaro e polimento dental.',
  },
  {
    id: 'proc-restauracao',
    name: 'Restauração em Resina',
    category: 'Restaurador',
    durationMin: 50,
    price: 260,
    color: '#6366f1',
    description: 'Restauração estética de cárie com resina composta.',
  },
  {
    id: 'proc-canal',
    name: 'Tratamento de Canal',
    category: 'Endodontia',
    durationMin: 90,
    price: 850,
    color: '#f59e0b',
    description: 'Tratamento endodôntico de dente com lesão pulpar.',
  },
  {
    id: 'proc-clareamento',
    name: 'Clareamento Dental',
    category: 'Estético',
    durationMin: 60,
    price: 600,
    color: '#ec4899',
    description: 'Clareamento a laser de consultório.',
  },
]

export const seedPatients: Patient[] = [
  {
    id: 'pat-1',
    name: 'Mariana Lopes',
    phone: '(11) 98877-1234',
    email: 'mariana.lopes@email.com',
    birthDate: '1992-04-12',
  },
  {
    id: 'pat-2',
    name: 'Rafael Andrade',
    phone: '(11) 99112-7788',
    email: 'rafael.andrade@email.com',
    birthDate: '1985-11-03',
  },
  {
    id: 'pat-3',
    name: 'Beatriz Nunes',
    phone: '(21) 98123-4567',
    birthDate: '2000-07-21',
  },
  {
    id: 'pat-4',
    name: 'Carlos Eduardo Pinto',
    phone: '(31) 99654-2211',
    email: 'carlos.pinto@email.com',
    birthDate: '1978-01-30',
  },
]

/** Gera consultas próximas à data atual para a demo não nascer vazia. */
function isoAt(dayOffset: number, hour: number, min = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

export const seedAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    procedureIds: ['proc-limpeza'],
    start: isoAt(0, 9, 0),
    end: isoAt(0, 9, 40),
    status: 'confirmado',
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    procedureIds: ['proc-restauracao'],
    start: isoAt(0, 11, 0),
    end: isoAt(0, 11, 50),
    status: 'agendado',
  },
  {
    id: 'apt-3',
    patientId: 'pat-3',
    procedureIds: ['proc-canal'],
    start: isoAt(1, 14, 0),
    end: isoAt(1, 15, 30),
    status: 'agendado',
  },
  {
    id: 'apt-4',
    patientId: 'pat-4',
    procedureIds: ['proc-clareamento', 'proc-limpeza'],
    start: isoAt(2, 10, 0),
    end: isoAt(2, 11, 40),
    status: 'confirmado',
    // total 780 — pagamento parcial de 300 (status: parcial)
    treatmentItems: [
      { id: 'ti-seed-1', procedureId: 'proc-clareamento', price: 600 },
      { id: 'ti-seed-2', procedureId: 'proc-limpeza', price: 180 },
    ],
    payments: [
      { id: 'pay-seed-1', amount: 300, method: 'credito', date: isoAt(-1, 9, 0) },
    ],
  },
  {
    id: 'apt-5',
    patientId: 'pat-1',
    procedureIds: ['proc-restauracao'],
    start: isoAt(-2, 16, 0),
    end: isoAt(-2, 16, 50),
    status: 'concluido',
    // total 260 — quitado (status: pago)
    treatmentItems: [
      { id: 'ti-seed-3', procedureId: 'proc-restauracao', tooth: 26, price: 260 },
    ],
    toothMarks: [
      {
        tooth: 26,
        condition: 'restaurado',
        faces: ['oclusal'],
        procedureId: 'proc-restauracao',
        done: true,
      },
    ],
    executionNotes: 'Restauração em resina na face oclusal do dente 26. Sem intercorrências.',
    payments: [
      { id: 'pay-seed-2', amount: 260, method: 'pix', date: isoAt(-2, 16, 55) },
    ],
  },
]
