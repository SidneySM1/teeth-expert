import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ClinicProvider } from '@/store/ClinicContext'
import { TooltipProvider } from '@/components/ui/Tooltip'
import '@/styles/global.css'
import '@/components/layout/layout.css'
import '@/components/appointment/form.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClinicProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ClinicProvider>
    </BrowserRouter>
  </StrictMode>,
)
