import MenuNav from "./components/menu/presentacion/menu"
import Footer from "./components/Footer/Footer"
import NotFound from "./components/NotFound/NotFount"
import Construct_page from "./components/Construction/construct_page"
import Services from "./components/Services/services"
import Home from "./components/Home/home"
import Contact from "./components/contact/contact"
import AuthProvider from "./auth/presentation/AuthProvider"
import ProductPage from "./product/presentation/ProductPage"
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
      { index: true, element: <Home /> },
      { path: "servicios", element: <Services /> },
      { path: "contacto", element: <Contact /> },
      { path: "productos", element: <ProductPage /> },
      { path: "historia", element: <Construct_page /> },
      { path: "equipo", element: <Construct_page /> },
      { path: "mision-vision", element: <Construct_page /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

// 🔹 App principal
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}