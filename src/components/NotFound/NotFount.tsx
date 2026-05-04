import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

export const NotFound = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Partículas
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy

        // rebote
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,0,0,0.15)"
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="position-relative vh-100 overflow-hidden bg-light">

      {/* 🎨 CANVAS BACKGROUND */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100"
      />

      {/* CONTENIDO */}
      <div className="position-relative d-flex flex-column justify-content-center align-items-center h-100 text-center px-3">

        <h1 className="display-1 fw-bold text-dark mb-2 animate-fade-in">
          404
        </h1>

        <h2 className="fw-semibold mb-2">
          Página no encontrada
        </h2>

        <p className="text-muted mb-4">
          La ruta que estás buscando no existe o fue movida.
        </p>

        <Link to="/" className="btn btn-dark px-4 py-2 shadow-sm">
          Volver al inicio
        </Link>

      </div>
    </div>
  )
}

export default NotFound