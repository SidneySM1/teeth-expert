import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: number
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 540,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="modal card"
            style={{ width }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {(title || subtitle) && (
              <header className="modal-head">
                <div>
                  {title && <h3>{title}</h3>}
                  {subtitle && <p className="muted modal-sub">{subtitle}</p>}
                </div>
                <button className="btn btn-icon btn-ghost" onClick={onClose}>
                  <X size={18} />
                </button>
              </header>
            )}
            <div className="modal-body scroll-y">{children}</div>
            {footer && <footer className="modal-foot">{footer}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
