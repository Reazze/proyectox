import { useRef, useEffect } from "react";
import { useAuth } from "../../auth/presentation/useAuth";
import { useCart } from "../../cart/presentation/useCart";
import { useBestSellers } from "../aplication/hooks/useBestSellers";
import BestSellers from "./BestSellers";

const ProductsHomeSection = () => {
  const { user, openLoginModal } = useAuth();
  const { addToCart } = useCart();
  const { bestSellers, loading, error } = useBestSellers(4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight ?? 260;
    };

    const draw = () => {
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      time += 0.01;

      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(13, 110, 253, 0.12)");
      gradient.addColorStop(1, "rgba(56, 189, 248, 0.08)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(width * 0.25, height * 0.55, 60 + Math.sin(time * 1.5) * 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.16)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.35, 90 + Math.cos(time) * 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(14, 165, 233, 0.12)";
      ctx.fill();

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      openLoginModal();
      return;
    }

    try {
      await addToCart(productId, 1);
    } catch {
      // El mensaje de error se muestra desde el contexto del carrito.
    }
  };

  return (
    <section className="py-5 position-relative overflow-hidden">
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.2, pointerEvents: "none" }}>
        <canvas ref={canvasRef} className="w-100 h-100"></canvas>
      </div>
      <div className="container position-relative">
        <div className="row align-items-center gy-4 mb-5">
          
        </div>

        <BestSellers items={bestSellers} onAddToCart={handleAddToCart} loading={loading} error={error} />
      </div>
    </section>
  );
};

export default ProductsHomeSection;
