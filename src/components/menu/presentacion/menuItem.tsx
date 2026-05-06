import type { Menu } from "../domain/entities/menu"
import { Link } from "react-router-dom"

export const MenuItem = ({ item }: { item: Menu }) => {
  if (item.children && item.children.length > 0) {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle fw-semibold"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
        >
          <i className={`bi ${item.icon} text-secondary`}></i> {item.name}
        </a>

        <ul className="dropdown-menu border-0">
          {item.children.map((child) => (
            <li key={child.id}>
              <Link className="dropdown-item" to={child.path?? " "}>
                <i className={`bi ${child.icon} text-secondary`}></i>{" "}
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    )
  }

  return (
    <li className="nav-item d-flex align-items-center">
      <Link className="nav-link fw-semibold" to={item.path ?? " "}>
        <i className={`bi ${item.icon} text-secondary`}></i> {item.name}
      </Link>
    </li>
  )
}