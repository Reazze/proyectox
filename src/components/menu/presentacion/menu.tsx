import { useEffect, useRef, useState } from "react"
import { useMenu } from "../aplication/hooks/useMenu"
import { MenuItem } from "./menuItem"
import { useAuth } from "../../../auth/presentation/useAuth"
import { useCart } from "../../../cart/presentation/useCart"
import { Link } from "react-router-dom"
import logo from "../../../assets/holding_logo.png"

export const MenuNav = () => {
  const menu = useMenu()
  const { user, logout, openLoginModal } = useAuth()
  const { openCart, cartCount } = useCart()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [userMenuOpen])

  const displayName = user?.name ?? "Usuario"
  const avatarUrl = user?.foto_perfil ?? ""

  const closeMobileMenu = () => {
    const offcanvasEl = document.querySelector(".offcanvas.show")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bootstrap = (window as any).bootstrap
    if (offcanvasEl && bootstrap?.Offcanvas) {
      const instance = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl)
      instance.hide()
    }
  }

  const handleOpenLogin = () => {
    closeMobileMenu()
    window.setTimeout(() => {
      openLoginModal()
    }, 160)
  }

  return (
    <nav className="navbar navbar-expand-lg shadow-sm border-bottom fixed-top" style={{background: "rgb(255, 255, 255, 0.8)"}}>
      <div className="container-fluid px-4">

        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid d-block d-sm-none"
            style={{ width: '100px', maxWidth: '100px' }}
          />
          <img
            src={logo}
            alt="Logo"
            className="img-fluid d-none d-sm-block d-md-none"
            style={{ width: '120px', maxWidth: '120px' }}
          />
          <img
            src={logo}
            alt="Logo"
            className="img-fluid d-none d-md-block d-lg-none"
            style={{ width: '130px', maxWidth: '130px' }}
          />
          <img
            src={logo}
            alt="Logo"
            className="img-fluid d-none d-lg-block"
            style={{ width: '140px', maxWidth: '140px' }}
          />
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="navbar-toggler border-0 d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* DESKTOP */}
        <div className="collapse navbar-collapse justify-content-between d-none d-lg-flex">

          <ul className="navbar-nav mx-auto gap-3">
            {menu.map((item) => (
              <li key={item.id} className="nav-item">
                <MenuItem item={item} />
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button type="button" className="btn btn-outline-secondary btn-icon" aria-label="Buscar">
              <i className="bi bi-search fs-5"></i>
            </button>
            <button type="button" className="btn btn-outline-secondary btn-icon position-relative" aria-label="Carrito" onClick={openCart}>
              <i className="bi bi-cart fs-5"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="dropdown" ref={userMenuRef}>
                <button
                  className="btn btn-link p-0 border-0 bg-transparent d-flex align-items-center gap-2 text-decoration-none"
                  type="button"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((state) => !state)}
                  style={{ minWidth: 0 }}
                >
                  <div className="rounded-circle overflow-hidden border flex-shrink-0" style={{ width: 42, height: 42 }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-secondary text-white w-100 h-100">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column text-start flex-shrink-1 min-vw-0">
                    <span className="fw-semibold text-dark small text-truncate d-block">{user.name}</span>
                    <small className="text-muted text-capitalize text-truncate d-block">{user.email}</small>
                  </div>
                  <i className="bi bi-chevron-down text-muted"></i>
                </button>
                <div className={`dropdown-menu dropdown-menu-end shadow-sm${userMenuOpen ? " show" : ""}`}>
                  <button
                    className="dropdown-item text-danger"
                    type="button"
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenLogin}>
                  Acceder
                </button>
              </div>
            )}
          </div>

        </div>

        {/* MOBILE */}
        <div
          className="offcanvas offcanvas-end w-50 d-lg-none"
          tabIndex={-1}
          id="offcanvasNavbar"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="fw-bold">Menú</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>

          <div className="offcanvas-body d-flex flex-column justify-content-between">

            <ul className="navbar-nav gap-2">
              {menu.map((item) => (
                <li key={item.id} className="nav-item">
                  <MenuItem item={item} />
                </li>
              ))}
            </ul>

            <div className="d-flex flex-column gap-2 pt-3 border-top">
              {user ? (
                <>
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle overflow-hidden border flex-shrink-0" style={{ width: 40, height: 40 }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center bg-secondary text-white w-100 h-100">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column text-truncate" style={{ minWidth: 0 }}>
                      <div className="fw-semibold text-truncate">{user.name}</div>
                      <small className="text-muted text-capitalize text-truncate">{user.email}</small>
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline-danger" onClick={logout}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-primary" onClick={handleOpenLogin} data-bs-dismiss="offcanvas">
                    Acceder
                  </button>
                </>
              )}
              <button type="button" className="btn btn-outline-secondary" onClick={() => {
                closeMobileMenu()
                openCart()
              }}>
                Ver carrito
              </button>
            </div>

          </div>
        </div>

      </div>
    </nav>
  )
}

export default MenuNav