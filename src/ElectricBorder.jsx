import { useRef } from 'react'
import './ElectricBorder.css'

export default function ElectricBorder({ children, className = '', color = '#b78cff', style }) {
  const borderRef = useRef(null)

  const updatePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div ref={borderRef} className={`electric-border ${className}`} style={{ '--electric-color': color, ...style }} onPointerMove={updatePointer}>
      <div className="electric-border__content">{children}</div>
    </div>
  )
}