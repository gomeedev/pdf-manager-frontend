import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  attractionStrength: number
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Initialize particles
    const particleCount = 2500
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        attractionStrength: Math.random() * 0.5 + 0.2,
      })
    }
    particlesRef.current = particles

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Animation loop (optimized)
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current

      // Update and draw particles
      particles.forEach((p) => {
        // Calculate distance to mouse
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        // Attraction to mouse
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * p.attractionStrength
          p.vx += (dx / distance) * force * 0.1
          p.vy += (dy / distance) * force * 0.1
        }

        // Apply friction
        p.vx *= 0.95
        p.vy *= 0.95

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Boundary wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.3 }}
    />
  )
}
