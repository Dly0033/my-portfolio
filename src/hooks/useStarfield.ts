import { useEffect, type RefObject } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface Star {
  x: number
  y: number
  r: number
  baseAlpha: number
  phase: number
  speed: number
}

export function useStarfield(canvasRef: RefObject<HTMLCanvasElement | null>): void {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const el = canvas
    const ctx = el.getContext('2d')
    if (!ctx) return
    const context = ctx

    let stars: Star[] = []
    let rafId = 0
    let width = 0
    let height = 0
    let running = true

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function buildStars(): void {
      const isMobile = width < 768
      const count = isMobile ? 70 : 180
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }))
    }

    function resize(): void {
      width = el.clientWidth
      height = el.clientHeight
      el.width = Math.floor(width * dpr)
      el.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
    }

    function draw(): void {
      context.clearRect(0, 0, width, height)
      for (const s of stars) {
        const twinkle = reducedMotion ? 1 : 0.5 + 0.5 * Math.sin(s.phase)
        context.globalAlpha = s.baseAlpha * twinkle
        context.fillStyle = '#F8FAFC'
        context.beginPath()
        context.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        context.fill()
        if (!reducedMotion) {
          s.phase += s.speed
          s.y -= s.speed * 20
          if (s.y < 0) {
            s.y = height
            s.x = Math.random() * width
          }
        }
      }
      context.globalAlpha = 1
    }

    function frame(): void {
      if (!running) return
      draw()
      rafId = requestAnimationFrame(frame)
    }

    function onVisibility(): void {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(rafId)
      } else if (!reducedMotion) {
        running = true
        rafId = requestAnimationFrame(frame)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    if (reducedMotion) {
      draw()
    } else {
      rafId = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [canvasRef, reducedMotion])
}
