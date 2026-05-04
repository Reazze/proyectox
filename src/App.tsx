import MenuNav from "./components/menu/presentacion/menu"
import NotFound from "./components/NotFound/NotFount"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom"

// 🔹 Layout dentro del mismo archivo
const Layout = () => {
  return (
    <>
      <MenuNav />
      <Outlet />
    </>
  )
}

// 🔹 Páginas
const Home = () => (<> <br /> <br /> <br /><h1>Home</h1> </>)
const Histaria = () => (<> <br /> <br /> <br /><h1>Historia</h1> </>)
const Contacto = () => (<> <br /> <br /> <br /><h1>Contacto</h1> </>)

// 🔹 Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "historia", element: <Histaria /> },
      { path: "contacto", element: <Contacto /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

// 🔹 App principal
export default function App() {
  return <RouterProvider router={router} />
}