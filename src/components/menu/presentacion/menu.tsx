import { useMenu } from "../aplication/hooks/useMenu";
import { MenuItem } from "./menuItem";

export const MenuNav = () => {
    const menu = useMenu();

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar</a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {menu.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
        </>
    )
}

export default MenuNav
