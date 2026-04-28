// presentation/components/Menu/MenuItem.tsx
import  type { Menu } from "../domain/entities/menu";

export const MenuItem = ({ item }: { item: Menu }) => {
  if (item.children && item.children.length > 0) {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle  fw-semibold"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
        >
         <i className={item.icon}></i> {item.name}
        </a>

        <ul className="dropdown-menu">
          {item.children.map((child) => (
            <li key={child.id}>
              <a className="dropdown-item  fw-semibold" href={child.path}>
               <i className={child.icon}></i> {child.name}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="nav-item d-flex align-items-center">
      <a className="nav-link  fw-semibold" href={item.path}>
       <i className={item.icon}></i> {item.name}
      </a>
    </li>
  );
};