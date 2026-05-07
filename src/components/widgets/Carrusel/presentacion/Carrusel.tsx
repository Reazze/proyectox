/* eslint-disable react-hooks/immutability */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCarrusel } from "../aplication/hooks/useCarrusel";

export const Carrusel = () => {
  const carrusel = useCarrusel();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 500;
    };

    resize();
    window.addEventListener("resize", resize);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const particles: any[] = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: Math.random() * 0.5,
        dy: Math.random() * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x > canvas.width) p.x = 0;
        if (p.y > canvas.height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Crear clones para infinito real
  const infiniteCarrusel = carrusel.length > 0
    ? [
        carrusel[carrusel.length - 1],
        ...carrusel,
        carrusel[0],
      ]
    : [];

  // Auto slider continuo
  useEffect(() => {
    if (carrusel.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, carrusel]);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  

  // Reset invisible para infinito real
  useEffect(() => {
    if (currentIndex === infiniteCarrusel.length - 1) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(1);
      }, 800);
    }

    if (currentIndex === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(carrusel.length);
      }, 800);
    }

    setTimeout(() => {
      setTransitionEnabled(true);
    }, 850);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="position-relative overflow-hidden" style={{ height: "500px" }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ zIndex: 1, background: "#0f172a" }}
      />

      {/* Slides */}
      <div
        className="d-flex h-100"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: transitionEnabled ? "transform 0.8s ease-in-out" : "none",
          zIndex: 2,
          position: "relative",
        }}
      >
        {infiniteCarrusel.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="w-100 flex-shrink-0 d-flex align-items-center justify-content-center text-white"
            style={{
              height: "500px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="text-center container mt-5">
              <h1 className="display-4 fw-bold mb-3">{item.title}</h1>
              <p className="lead mb-4">{item.description}</p>

              {item.path && (
                <Link
                  to={item.path}
                  className="btn btn-light px-4 py-2 fw-semibold"
                >
                  Ver más
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-3"
        style={{ zIndex: 3 }}
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <button
        onClick={nextSlide}
        className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-3"
        style={{ zIndex: 3 }}
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Indicators */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-4"
        style={{ zIndex: 3 }}
      >
        {carrusel.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index + 1)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor:
                currentIndex === index + 1
                  ? "white"
                  : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrusel;
