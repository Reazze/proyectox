import React, { useEffect, useRef } from "react";
import {Link} from "react-router-dom";

export const UnderConstruction: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Crear partículas
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: Math.random() * 1 - 0.5,
        dy: Math.random() * 1 - 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="position-relative vh-100 d-flex align-items-center justify-content-center bg-dark text-light">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100"
      />

      {/* Contenido */}
      <div className="text-center position-relative">
        <h1 className="display-4 fw-bold mb-3">Página en Construcción</h1>
        <p className="lead text-secondary mb-4">
          Estamos trabajando para ofrecerte una mejor experiencia.
        </p>

        {/* Loader */}
        <div className="spinner-border text-light mb-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        {/* Botón */}
        <div>
          <Link to="/" className="btn btn-outline-light px-4">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;