// presentation/components/Menu/MenuItem.tsx
import  type { Menu } from "../domain/entities/menu";

export const MenuItem = ({ item }: { item: Menu }) => {
  if (item.children && item.children.length > 0) {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
        >
          {item.name}
        </a>

        <ul className="dropdown-menu">
          {item.children.map((child) => (
            <li key={child.id}>
              <a className="dropdown-item" href={child.path}>
                {child.name}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <a className="nav-link" href={item.path}>
        {item.name}
      </a>
    </li>
  );
};