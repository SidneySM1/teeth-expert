import * as RS from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import './select.css'

export interface SelectOption {
  value: string
  label: string
  /** cor opcional para um marcador à esquerda */
  color?: string
  hint?: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  /** conteúdo extra renderizado antes das opções (ex.: "— Nenhum —") */
  leading?: ReactNode
  ariaLabel?: string
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Selecione…',
  ariaLabel,
  className,
}: SelectProps) {
  const selected = options.find((o) => o.value === value)
  return (
    <RS.Root value={value || undefined} onValueChange={onChange}>
      <RS.Trigger className={`ui-select ${className ?? ''}`} aria-label={ariaLabel}>
        <span className="ui-select-value">
          {selected?.color && (
            <span className="dot" style={{ background: selected.color }} />
          )}
          <RS.Value placeholder={placeholder}>
            {selected ? selected.label : placeholder}
          </RS.Value>
        </span>
        <RS.Icon className="ui-select-icon">
          <ChevronDown size={16} />
        </RS.Icon>
      </RS.Trigger>

      <RS.Portal>
        <RS.Content
          className="ui-select-content"
          position="popper"
          sideOffset={6}
        >
          <RS.Viewport className="ui-select-viewport">
            {options.map((o) => (
              <RS.Item key={o.value} value={o.value} className="ui-select-item">
                <span className="ui-select-item-main">
                  {o.color && (
                    <span className="dot" style={{ background: o.color }} />
                  )}
                  <RS.ItemText>{o.label}</RS.ItemText>
                  {o.hint && <span className="ui-select-hint">{o.hint}</span>}
                </span>
                <RS.ItemIndicator className="ui-select-check">
                  <Check size={15} />
                </RS.ItemIndicator>
              </RS.Item>
            ))}
          </RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  )
}
