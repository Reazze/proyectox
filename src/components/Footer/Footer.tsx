import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light pt-2 pb-3">
        <hr className="border-secondary" />
      <div className="container mt-4">
        <div className="row">

          {/* Marca / Descripción */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">MiEmpresa</h5>
            <p className="small text-secondary">
              Plataforma digital enfocada en brindar soluciones modernas
              para comercio electrónico y servicios educativos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-semibold">Enlaces</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none text-secondary">Inicio</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Nosotros</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Servicios</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Contacto</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold">Soporte</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none text-secondary">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Política de Privacidad</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold">Contacto</h6>
            <ul className="list-unstyled small text-secondary">
              <li><i className="bi bi-geo-alt"></i> Lima, Perú</li>
              <li><i className="bi bi-envelope"></i> contacto@miempresa.com</li>
              <li><i className="bi bi-phone"></i> +51 999 999 999</li>
            </ul>

            {/* Redes Sociales */}
            <div className="mt-3">
              <a href="#" className="text-secondary me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-secondary me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-secondary me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-secondary"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

        </div>

        <hr className="border-secondary" />

        {/* Bottom */}
        <div className="text-center small text-secondary">
          © {new Date().getFullYear()} MiEmpresa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;