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
    const numParticles = 140
    const particles: any[] = []

    // Helper to get random color
    const colors = [
      'rgba(59, 130, 246, 1)',  // Blue
      'rgba(236, 72, 153, 1)',  // Pink
      'rgba(16, 185, 129, 1)',  // Emerald
      'rgba(139, 92, 246, 1)',  // Violet
      'rgba(0, 0, 0, 0.5)'        // Gray/Black
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

        // Mouse gravity: particles form an orbital sphere around the cursor
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influenceRadius = 200
        const sphereRadius = 60

        if (dist < influenceRadius) {
          const force = (influenceRadius - dist) / influenceRadius
          // Target position on the circumference of the sphere
          const angle = Math.atan2(dy, dx)
          const targetX = mouse.x + Math.cos(angle) * sphereRadius
          const targetY = mouse.y + Math.sin(angle) * sphereRadius
          
          // Gradually pull particles towards the sphere surface
          p.x += (targetX - p.x) * force * 0.05
          p.y += (targetY - p.y) * force * 0.05
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
