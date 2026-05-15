export default function ContactForm() {
  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-1"
      style={{
        background:
          '#fff',
      }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-lg-10 col-xl-9">
          <div
            className="card border-0 shadow-lg overflow-hidden"
            style={{
              borderRadius: '28px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="row g-0">
              {/* LEFT SIDE */}
              <div
                className="col-lg-5 text-white p-5 d-flex flex-column justify-content-between"
                style={{
                  background:
                    'linear-gradient(160deg, #2563eb 0%, #1d4ed8 45%, #1e40af 100%)',
                }}
              >

                <div className="mt-5">
                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: 50, height: 50 }}
                    >
                      <i className="bi bi-envelope-fill"></i>
                    </div>

                    <div>
                      <small className="opacity-75">Correo</small>
                      <h6 className="mb-0">contacto@empresa.com</h6>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: 50, height: 50 }}
                    >
                      <i className="bi bi-telephone-fill"></i>
                    </div>

                    <div>
                      <small className="opacity-75">Teléfono</small>
                      <h6 className="mb-0">+51 999 999 999</h6>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: 50, height: 50 }}
                    >
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>

                    <div>
                      <small className="opacity-75">Ubicación</small>
                      <h6 className="mb-0">Lima, Perú</h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-lg-7 bg-white p-5">
                <div className="mb-4">
                  <h2 className="fw-bold text-dark mb-2">
                    Envíanos un mensaje
                  </h2>

                  <p className="text-secondary">
                    Completa el formulario y nuestro equipo se pondrá en
                    contacto contigo.
                  </p>
                </div>

                <form>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Nombre
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person-fill"></i>
                        </span>

                        <input
                          type="text"
                          className="form-control border-start-0 py-3"
                          placeholder="Ingrese su nombre"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Correo
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope-fill"></i>
                        </span>

                        <input
                          type="email"
                          className="form-control border-start-0 py-3"
                          placeholder="correo@empresa.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Asunto
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-chat-left-text-fill"></i>
                      </span>

                      <input
                        type="text"
                        className="form-control border-start-0 py-3"
                        placeholder="Asunto del mensaje"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Mensaje
                    </label>

                    <textarea
                      className="form-control py-3"
                      rows={6}
                      placeholder="Escriba aquí su mensaje..."
                    ></textarea>
                  </div>

                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="privacy"
                      />

                      <label
                        className="form-check-label text-secondary"
                        htmlFor="privacy"
                      >
                        Acepto las políticas de privacidad
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary px-5 py-3 fw-semibold shadow"
                      style={{
                        borderRadius: '14px',
                        background:
                          'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        border: 'none',
                      }}
                    >
                      <i className="bi bi-send-fill me-2"></i>
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
