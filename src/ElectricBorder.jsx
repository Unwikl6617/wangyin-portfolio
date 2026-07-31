import { useEffect, useRef } from 'react'
import './ElectricBorder.css'

function OrganicBorder({ color, speed = 0.55, chaos = 0.025 }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined

    let width = 0
    let height = 0
    let dpr = 1
    const resize = () => {
      const bounds = host.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(bounds.width, 1)
      height = Math.max(bounds.height, 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    const roundedRect = (time) => {
      const inset = 2
      const radius = Math.min(22, width * 0.04, height * 0.1)
      const points = []
      const perimeter = 2 * (width + height - radius * 2) + Math.PI * radius * 2
      const total = Math.max(180, Math.floor(perimeter / 3))
      for (let index = 0; index <= total; index += 1) {
        const progress = index / total
        const distance = progress * perimeter
        let x = inset + radius
        let y = inset
        const top = width - radius * 2
        const right = height - radius * 2
        const arc = Math.PI * radius / 2
        let cursor = distance
        if (cursor <= top) x += cursor
        else if ((cursor -= top) <= arc) { x = width - inset - radius + Math.cos(-Math.PI / 2 + cursor / arc * Math.PI / 2) * radius; y = inset + radius + Math.sin(-Math.PI / 2 + cursor / arc * Math.PI / 2) * radius }
        else if ((cursor -= arc) <= right) { x = width - inset; y = inset + radius + cursor }
        else if ((cursor -= right) <= arc) { x = width - inset - radius + Math.cos(cursor / arc * Math.PI / 2) * radius; y = height - inset - radius + Math.sin(cursor / arc * Math.PI / 2) * radius }
        else if ((cursor -= arc) <= top) { x = width - inset - radius - cursor; y = height - inset }
        else if ((cursor -= top) <= arc) { x = inset + radius + Math.cos(Math.PI / 2 + cursor / arc * Math.PI / 2) * radius; y = height - inset - radius + Math.sin(Math.PI / 2 + cursor / arc * Math.PI / 2) * radius }
        else if ((cursor -= arc) <= right) { x = inset; y = height - inset - radius - cursor }
        else { cursor -= right; x = inset + radius + Math.cos(Math.PI + cursor / arc * Math.PI / 2) * radius; y = inset + radius + Math.sin(Math.PI + cursor / arc * Math.PI / 2) * radius }
        const wave = Math.sin(progress * 32 + time * 0.002) * chaos * 18 + Math.sin(progress * 71 - time * 0.003) * chaos * 9
        points.push([x + wave, y + wave])
      }
      return points
    }

    const draw = (time) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      const points = roundedRect(time * speed)
      context.beginPath()
      points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y))
      context.closePath()
      context.strokeStyle = color
      context.globalAlpha = 0.9
      context.lineWidth = 1.2
      context.shadowColor = color
      context.shadowBlur = 12
      context.stroke()
      context.globalAlpha = 1
      context.shadowBlur = 0
      frameRef.current = requestAnimationFrame(draw)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    frameRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frameRef.current); observer.disconnect() }
  }, [chaos, color, speed])

  return <canvas ref={canvasRef} className="organic-border-canvas" aria-hidden="true" />
}

export default function ElectricBorder({ children, className = '', color = '#b78cff', style, variant = 'trace' }) {
  const borderRef = useRef(null)
  const isOrganic = variant === 'organic'

  const updatePointer = (event) => {
    if (isOrganic) return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div ref={borderRef} className={`electric-border ${isOrganic ? 'electric-border--organic' : ''} ${className}`} style={{ '--electric-color': color, ...style }} onPointerMove={updatePointer}>
      {isOrganic && <OrganicBorder color={color} />}
      <div className="electric-border__content">{children}</div>
    </div>
  )
}
