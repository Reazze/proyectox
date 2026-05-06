import { useMenu } from "../aplication/hooks/useMenu"
import { MenuItem } from "./menuItem"
import { Link } from "react-router-dom"
import logo from "../../../assets/holding_logo.png"

export const MenuNav = () => {
  const menu = useMenu()

  return (
    <nav className="navbar navbar-expand-lg shadow-sm border-bottom fixed-top" style={{background: "rgb(255, 255, 255, 0.8)"}}>
      <div className="container-fluid px-4">

        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <img src={logo} alt="Logo" width="140" className="img-fluid mx-4" />
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
            <i className="bi bi-search fs-5"></i>
            <i className="bi bi-person fs-5"></i>
            <i className="bi bi-cart fs-5 position-relative">
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                2
              </span>
            </i>
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

            <div className="d-flex justify-content-around border-top pt-3">
              <i className="bi bi-search fs-5"></i>
              <i className="bi bi-person fs-5"></i>
              <i className="bi bi-cart fs-5"></i>
            </div>

          </div>
        </div>

      </div>
    </nav>
  )
}

export default MenuNav