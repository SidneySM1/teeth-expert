import * as RT from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import './tooltip.css'

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RT.Provider delayDuration={250} skipDelayDuration={300}>
      {children}
    </RT.Provider>
  )
}

interface TipProps {
  label: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** quando o filho não for um elemento que aceite ref, usar wrapper */
  asChild?: boolean
}

export function Tip({ label, children, side = 'top', asChild = true }: TipProps) {
  if (label == null || label === '') return <>{children}</>
  return (
    <RT.Root>
      <RT.Trigger asChild={asChild}>
        {asChild ? children : <span className="tip-trigger">{children}</span>}
      </RT.Trigger>
      <RT.Portal>
        <RT.Content className="tip" side={side} sideOffset={8}>
          {label}
          <RT.Arrow className="tip-arrow" width={11} height={6} />
        </RT.Content>
      </RT.Portal>
    </RT.Root>
  )
}
