import MenuNav from "./components/menu/presentacion/menu"
import Footer from "./components/Footer/Footer"
import NotFound from "./components/NotFound/NotFount"
import Construc_page from "./components/Construction/construct_page"
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
      <Footer />
    </>
  )
}



// 🔹 Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Construc_page /> },
      { path: "servicios", element: <Construc_page /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

// 🔹 App principal
export default function App() {
  return <RouterProvider router={router} />
}