import { useEffect, useRef } from 'react'

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    // Antigravity style: fewer dots, flowing slowly, slightly colored
    const numParticles = 120
    const particles: any[] = []

    // Helper to get random color
    const colors = [
      'rgba(59, 130, 246, 0.4)',  // Blue
      'rgba(236, 72, 153, 0.4)',  // Pink
      'rgba(16, 185, 129, 0.4)',  // Emerald
      'rgba(139, 92, 246, 0.4)',  // Violet
      'rgba(0, 0, 0, 0.3)'        // Gray/Black
    ]

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        offset: Math.random() * Math.PI * 2 // for sine wave movement
      })
    }

    const mouse = { x: -1000, y: -1000 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i]

        // Subtle sine wave motion
        p.y += Math.sin(Date.now() * 0.001 + p.offset) * 0.2
        
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Mouse repulse/attract interactivo
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.x -= dx * force * 0.02
          p.y -= dy * force * 0.02
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" />
  )
}
