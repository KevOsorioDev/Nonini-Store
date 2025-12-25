import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { 
  MainPage, 
  ProductPage, 
  ErrorPage,
  LoginPage,
  RegistroPage,
  CheckoutPage,
  PagoExitoPage,
  PagoErrorPage,
  AdminPage,
  CambiarPasswordPage,
  TransferenciaBancariaPage,
  CategoriaPage
} from './Pages/indexPages.js'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "producto/:id", element: <ProductPage /> },
      { path: "productos", element: <CategoriaPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orden/:ordenId/exito", element: <PagoExitoPage /> },
      { path: "orden/:ordenId/fallo", element: <PagoErrorPage /> },
      { path: "orden/:ordenId/transferencia", element: <TransferenciaBancariaPage /> },
    ],
  },
  // Rutas sin navbar/footer
  { path: "/login", element: <LoginPage /> },
  { path: "/registro", element: <RegistroPage /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/cambiar-password", element: <CambiarPasswordPage /> },
])