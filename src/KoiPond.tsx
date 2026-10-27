import { useEffect, useRef } from 'react'
import { Pond } from './pond'

export default function KoiPond() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pond = new Pond(canvas)
    return () => pond.destroy()
  }, [])

  return <canvas ref={canvasRef} className="koi-pond" aria-hidden="true" />
}
