import { useRef } from 'react'
import { useStarfield } from '@/hooks/useStarfield'

export function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useStarfield(ref)

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 h-full w-full" />
}
