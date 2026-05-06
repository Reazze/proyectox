import React, { useEffect, useRef } from "react";
import fondo from "../../assets/hero_fondo.png"

type Props = {
    title: string;
    subtitle: string;
    backgroundImage?: string;
};

export const HeroCanvas: React.FC<Props> = ({
    title,
    subtitle,
    backgroundImage,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = 350;
        };

        resize();
        window.addEventListener("resize", resize);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const particles: any[] = [];

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 1,
                dx: Math.random() * 0.5,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fill();

                p.x += p.dx;
                if (p.x > canvas.width) p.x = 0;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div
            className="position-relative d-flex align-items-center justify-content-center text-center text-white"
            style={{
                height: "300px",
                backgroundImage: `url(${backgroundImage ?? fondo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1 }}
            />

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ zIndex: 2 }}
            />

            {/* Contenido */}
            <div className="position-relative mt-5" style={{ zIndex: 3 }}>
                <h1 className="fw-bold display-5">{title}</h1>
                <p className="lead text-light">{subtitle}</p>
            </div>
        </div>
    );
};

export default HeroCanvas;