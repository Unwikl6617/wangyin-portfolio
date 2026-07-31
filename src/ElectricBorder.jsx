import { useCallback, useEffect, useRef } from 'react'
import './ElectricBorder.css'

function OrganicBorder({ color, speed = 0.6, chaos = 0.09, borderRadius = 22 }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const timeRef = useRef(0)
  const lastFrameRef = useRef(0)

  const random = useCallback((value) => (Math.sin(value * 12.9898) * 43758.5453) % 1, [])
  const noise2D = useCallback((x, y) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = x - x0
    const ty = y - y0
    const smoothX = tx * tx * (3 - 2 * tx)
    const smoothY = ty * ty * (3 - 2 * ty)
    const a = random(x0 + y0 * 57)
    const b = random(x0 + 1 + y0 * 57)
    const c = random(x0 + (y0 + 1) * 57)
    const d = random(x0 + 1 + (y0 + 1) * 57)
    return a * (1 - smoothX) * (1 - smoothY) + b * smoothX * (1 - smoothY) + c * (1 - smoothX) * smoothY + d * smoothX * smoothY
  }, [random])
  const noise = useCallback((x, time, seed) => {
    let value = 0
    let amplitude = chaos
    let frequency = 10
    for (let index = 0; index < 10; index += 1) {
      value += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3)
      frequency *= 1.6
      amplitude *= 0.7
    }
    return value
  }, [chaos, noise2D])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !host || !context) return undefined
    const offset = 28
    let width = 1
    let height = 1
    let ratio = 1
    const resize = () => {
      const bounds = host.getBoundingClientRect()
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width + offset * 2
      height = bounds.height + offset * 2
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }
    const pointOnRect = (progress) => {
      const left = offset
      const top = offset
      const rectWidth = width - offset * 2
      const rectHeight = height - offset * 2
      const radius = Math.min(borderRadius, rectWidth / 2, rectHeight / 2)
      const horizontal = rectWidth - radius * 2
      const vertical = rectHeight - radius * 2
      const corner = Math.PI * radius / 2
      const perimeter = horizontal * 2 + vertical * 2 + corner * 4
      let distance = progress * perimeter
      if (distance <= horizontal) return { x: left + radius + distance, y: top }
      distance -= horizontal
      if (distance <= corner) { const angle = -Math.PI / 2 + distance / corner * Math.PI / 2; return { x: left + rectWidth - radius + Math.cos(angle) * radius, y: top + radius + Math.sin(angle) * radius } }
      distance -= corner
      if (distance <= vertical) return { x: left + rectWidth, y: top + radius + distance }
      distance -= vertical
      if (distance <= corner) { const angle = distance / corner * Math.PI / 2; return { x: left + rectWidth - radius + Math.cos(angle) * radius, y: top + rectHeight - radius + Math.sin(angle) * radius } }
      distance -= corner
      if (distance <= horizontal) return { x: left + rectWidth - radius - distance, y: top + rectHeight }
      distance -= horizontal
      if (distance <= corner) { const angle = Math.PI / 2 + distance / corner * Math.PI / 2; return { x: left + radius + Math.cos(angle) * radius, y: top + rectHeight - radius + Math.sin(angle) * radius } }
      distance -= corner
      if (distance <= vertical) return { x: left, y: top + rectHeight - radius - distance }
      distance -= vertical
      const angle = Math.PI + distance / corner * Math.PI / 2
      return { x: left + radius + Math.cos(angle) * radius, y: top + radius + Math.sin(angle) * radius }
    }
    const draw = (now) => {
      const delta = lastFrameRef.current ? (now - lastFrameRef.current) / 1000 : 0
      lastFrameRef.current = now
      timeRef.current += delta * speed
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      const samples = Math.max(220, Math.floor((width + height) * 0.42))
      context.beginPath()
      for (let index = 0; index <= samples; index += 1) {
        const progress = index / samples
        const point = pointOnRect(progress)
        const displacement = 42
        const x = point.x + noise(progress * 8, timeRef.current, 0) * displacement
        const y = point.y + noise(progress * 8, timeRef.current, 1) * displacement
        if (index === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.closePath()
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 1.1
      context.strokeStyle = color
      context.shadowColor = color
      context.shadowBlur = 14
      context.stroke()
      context.shadowBlur = 0
      animationRef.current = requestAnimationFrame(draw)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    animationRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animationRef.current); observer.disconnect() }
  }, [borderRadius, color, noise, speed])

  return <div className="organic-border-canvas-wrap" aria-hidden="true"><canvas ref={canvasRef} className="organic-border-canvas" /></div>
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
