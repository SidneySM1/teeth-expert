import { Route, Routes } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { AgendaPage } from '@/pages/AgendaPage'
import { ProceduresPage } from '@/components/procedures/ProceduresPage'
import { PatientsPage } from '@/components/patient/PatientsPage'

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <div className="main-inner">
          <Routes>
            <Route path="/" element={<AgendaPage />} />
            <Route path="/pacientes" element={<PatientsPage />} />
            <Route path="/procedimentos" element={<ProceduresPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
