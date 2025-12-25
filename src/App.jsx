import './App.css'
import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from './components/index.js'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'
import Lenis from 'lenis'

const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const App = () => {
  return (
    <CartProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: 'var(--persian-plum-600)',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </CartProvider>
  )
}

export default App
