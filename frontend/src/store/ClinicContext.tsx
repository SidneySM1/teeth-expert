import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Appointment,
  Patient,
  Payment,
  Procedure,
  TreatmentItem,
} from '@/types'
import { seedAppointments, seedPatients, seedProcedures } from '@/data/seed'
import { load, save, uid } from './storage'

interface ClinicState {
  patients: Patient[]
  procedures: Procedure[]
  appointments: Appointment[]

  // Pacientes
  addPatient: (data: Omit<Patient, 'id'>) => Patient
  // Procedimentos
  addProcedure: (data: Omit<Procedure, 'id'>) => Procedure
  updateProcedure: (id: string, patch: Partial<Procedure>) => void
  removeProcedure: (id: string) => void
  // Consultas
  addAppointment: (data: Omit<Appointment, 'id'>) => Appointment
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  removeAppointment: (id: string) => void
  // Itens realizados
  addTreatmentItem: (appointmentId: string, data: Omit<TreatmentItem, 'id'>) => void
  updateTreatmentItem: (
    appointmentId: string,
    itemId: string,
    patch: Partial<TreatmentItem>,
  ) => void
  removeTreatmentItem: (appointmentId: string, itemId: string) => void
  // Pagamentos
  addPayment: (appointmentId: string, data: Omit<Payment, 'id'>) => void
  removePayment: (appointmentId: string, paymentId: string) => void

  // Helpers
  patientById: (id: string) => Patient | undefined
  procedureById: (id: string) => Procedure | undefined
  resetDemo: () => void
}

const ClinicContext = createContext<ClinicState | null>(null)

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() =>
    load('patients', seedPatients),
  )
  const [procedures, setProcedures] = useState<Procedure[]>(() =>
    load('procedures', seedProcedures),
  )
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    load('appointments', seedAppointments),
  )

  useEffect(() => save('patients', patients), [patients])
  useEffect(() => save('procedures', procedures), [procedures])
  useEffect(() => save('appointments', appointments), [appointments])

  const addPatient = useCallback((data: Omit<Patient, 'id'>) => {
    const patient: Patient = { ...data, id: uid('pat') }
    setPatients((p) => [...p, patient])
    return patient
  }, [])

  const addProcedure = useCallback((data: Omit<Procedure, 'id'>) => {
    const proc: Procedure = { ...data, id: uid('proc') }
    setProcedures((p) => [...p, proc])
    return proc
  }, [])

  const updateProcedure = useCallback((id: string, patch: Partial<Procedure>) => {
    setProcedures((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }, [])

  const removeProcedure = useCallback((id: string) => {
    setProcedures((p) => p.filter((x) => x.id !== id))
  }, [])

  const addAppointment = useCallback((data: Omit<Appointment, 'id'>) => {
    const apt: Appointment = { ...data, id: uid('apt') }
    setAppointments((a) => [...a, apt])
    return apt
  }, [])

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Appointment>) => {
      setAppointments((a) => a.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    },
    [],
  )

  const removeAppointment = useCallback((id: string) => {
    setAppointments((a) => a.filter((x) => x.id !== id))
  }, [])

  const addTreatmentItem = useCallback(
    (appointmentId: string, data: Omit<TreatmentItem, 'id'>) => {
      const item: TreatmentItem = { ...data, id: uid('ti') }
      setAppointments((a) =>
        a.map((x) =>
          x.id === appointmentId
            ? { ...x, treatmentItems: [...(x.treatmentItems ?? []), item] }
            : x,
        ),
      )
    },
    [],
  )

  const updateTreatmentItem = useCallback(
    (appointmentId: string, itemId: string, patch: Partial<TreatmentItem>) => {
      setAppointments((a) =>
        a.map((x) =>
          x.id === appointmentId
            ? {
                ...x,
                treatmentItems: (x.treatmentItems ?? []).map((it) =>
                  it.id === itemId ? { ...it, ...patch } : it,
                ),
              }
            : x,
        ),
      )
    },
    [],
  )

  const removeTreatmentItem = useCallback(
    (appointmentId: string, itemId: string) => {
      setAppointments((a) =>
        a.map((x) =>
          x.id === appointmentId
            ? {
                ...x,
                treatmentItems: (x.treatmentItems ?? []).filter(
                  (it) => it.id !== itemId,
                ),
              }
            : x,
        ),
      )
    },
    [],
  )

  const addPayment = useCallback(
    (appointmentId: string, data: Omit<Payment, 'id'>) => {
      const payment: Payment = { ...data, id: uid('pay') }
      setAppointments((a) =>
        a.map((x) =>
          x.id === appointmentId
            ? { ...x, payments: [...(x.payments ?? []), payment] }
            : x,
        ),
      )
    },
    [],
  )

  const removePayment = useCallback(
    (appointmentId: string, paymentId: string) => {
      setAppointments((a) =>
        a.map((x) =>
          x.id === appointmentId
            ? { ...x, payments: (x.payments ?? []).filter((p) => p.id !== paymentId) }
            : x,
        ),
      )
    },
    [],
  )

  const resetDemo = useCallback(() => {
    setPatients(seedPatients)
    setProcedures(seedProcedures)
    setAppointments(seedAppointments)
  }, [])

  const patientById = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients],
  )
  const procedureById = useCallback(
    (id: string) => procedures.find((p) => p.id === id),
    [procedures],
  )

  const value = useMemo<ClinicState>(
    () => ({
      patients,
      procedures,
      appointments,
      addPatient,
      addProcedure,
      updateProcedure,
      removeProcedure,
      addAppointment,
      updateAppointment,
      removeAppointment,
      addTreatmentItem,
      updateTreatmentItem,
      removeTreatmentItem,
      addPayment,
      removePayment,
      patientById,
      procedureById,
      resetDemo,
    }),
    [
      patients,
      procedures,
      appointments,
      addPatient,
      addProcedure,
      updateProcedure,
      removeProcedure,
      addAppointment,
      updateAppointment,
      removeAppointment,
      addTreatmentItem,
      updateTreatmentItem,
      removeTreatmentItem,
      addPayment,
      removePayment,
      patientById,
      procedureById,
      resetDemo,
    ],
  )

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useClinic(): ClinicState {
  const ctx = useContext(ClinicContext)
  if (!ctx) throw new Error('useClinic deve ser usado dentro de <ClinicProvider>')
  return ctx
}
