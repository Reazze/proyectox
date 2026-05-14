import { useEffect, useRef, useState, type FormEvent } from "react";
import type { LoginCredentials, RegisterData } from "../domain/entities/User";

type AuthModalMode = "none" | "login" | "register";

type Props = {
  mode: AuthModalMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthModalMode) => void;
  onLogin: (credentials: LoginCredentials) => Promise<unknown>;
  onRegister: (data: RegisterData) => Promise<unknown>;
};

const AuthModal = ({ mode, onClose, onSwitchMode, onLogin, onRegister }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setError(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      time += 0.008;

      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createRadialGradient(
        width * 0.75 + Math.sin(time) * 120,
        height * 0.25 + Math.cos(time) * 80,
        50,
        width * 0.75,
        height * 0.25,
        width * 0.6,
      );
      gradient.addColorStop(0, "rgba(105, 208, 249, 0.65)");
      gradient.addColorStop(0.4, "rgba(86, 146, 255, 0.18)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(width * 0.25, height * 0.35, 120 + Math.sin(time * 1.7) * 15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.75, 90 + Math.cos(time * 1.3) * 12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
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

  const isLogin = mode === "login";
  const title = isLogin ? "Iniciar sesión" : "Crear cuenta";
  const buttonLabel = isLogin ? "Ingresar" : "Registrarme";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        await onLogin({ email, password });
      } else {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }

        if (!name.trim()) {
          throw new Error("El nombre de usuario es requerido.");
        }

        await onRegister({ email, password, name: name.trim(), role: "cliente" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === "none") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="authModalTitle"
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", zIndex: 1055 }}
      onClick={onClose}
    >
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ pointerEvents: "none", opacity: 0.55 }}
      />

      <div
        className="position-relative bg-white rounded-4 shadow-lg overflow-hidden"
        style={{ width: "min(100%, 740px)", maxWidth: 740, minHeight: 520 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.15), transparent 40%), radial-gradient(circle at 80% 15%, rgba(14, 165, 233, 0.15), transparent 35%)", pointerEvents: "none" }}
        />

        <div className="row g-0 align-items-stretch h-100">
          <div className="col-md-6 d-none d-md-flex flex-column justify-content-between p-4 bg-dark text-white" style={{ minHeight: 520 }}>
            <div>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <span className="badge bg-primary rounded-pill px-3 py-2">Campus seguro</span>
                </div>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={onClose} aria-label="Cerrar modal">
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <h2 className="display-6 fw-bold">Bienvenido de nuevo</h2>
              <p className="text-muted">Accede a tu cuenta y disfruta de un entorno seguro de compras. Registra una nueva cuenta en segundos y mantente al día con tus pedidos.</p>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center" style={{ width: 52, height: 52 }}>
                  <i className="bi bi-shield-lock fs-4"></i>
                </div>
                <div>
                  <h6 className="mb-0">Interfaz intuitiva</h6>
                  <small className="text-muted">Navegación clara y amigable</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 id="authModalTitle" className="fw-bold mb-1">{title}</h3>
                <p className="text-muted mb-0">{isLogin ? "Introduce tus datos para iniciar sesión" : "Crea una nueva cuenta y accede al servicio"}</p>
              </div>
              <button type="button" className="btn-close" aria-label="Cerrar modal" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit} className="mb-3">
              <div className="mb-3">
                <label htmlFor="authEmail" className="form-label">Email</label>
                <input
                  id="authEmail"
                  type="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="authName" className="form-label">Nombre de usuario</label>
                  <input
                    id="authName"
                    type="text"
                    className="form-control form-control-lg"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="authPassword" className="form-label">Contraseña</label>
                <input
                  id="authPassword"
                  type="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>
              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="authConfirmPassword" className="form-label">Repetir contraseña</label>
                  <input
                    id="authConfirmPassword"
                    type="password"
                    className="form-control form-control-lg"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              )}
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={submitting}>
                {submitting ? (isLogin ? "Ingresando..." : "Registrando...") : buttonLabel}
              </button>
            </form>

            <div className="text-center">
              {isLogin ? (
                <p className="mb-0 text-muted">
                  ¿No tienes cuenta?{' '}
                  <button type="button" className="btn btn-link p-0" onClick={() => onSwitchMode("register")}>
                    Regístrate
                  </button>
                </p>
              ) : (
                <p className="mb-0 text-muted">
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" className="btn btn-link p-0" onClick={() => onSwitchMode("login")}>
                    Inicia sesión
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
