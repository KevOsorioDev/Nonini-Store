import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Navbar, Footer, InteractionProvider, HamburgerMenu } from './components/index.js'
import { Carrito } from './components/Carrito/Carrito'
import { CartProvider } from './context/CartContext'
import { categoriasService } from './services/api'
import './lenis.js'

import './App.css'

const App = () => {
  const [categorias, setCategorias] = useState([])
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [carritoOpen, setCarritoOpen] = useState(false)

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      const data = await categoriasService.obtenerTodas()
      setCategorias(data)
    } catch {
      // Servidor no disponible - usar categorías por defecto
      setCategorias([
        { id: 1, nombre: 'Nike', slug: 'nike' },
        { id: 2, nombre: 'Mascotas', slug: 'mascotas' },
        { id: 3, nombre: 'Disney/Pixar', slug: 'disney-pixar' }
      ])
    }
  }

  return (
    <InteractionProvider>
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
        <Navbar 
          hamburgerOpen={hamburgerOpen} 
          onHamburgerToggle={() => setHamburgerOpen(!hamburgerOpen)}
          onCartOpen={() => setCarritoOpen(true)}
        />
        {/* Menú hamburguesa fuera del header para que no se anime con el scroll */}
        <HamburgerMenu 
          categorias={categorias} 
          onCartOpen={() => {
            setCarritoOpen(true)
            setHamburgerOpen(false)
          }} 
          isOpen={hamburgerOpen}
          onClose={() => setHamburgerOpen(false)}
        />
        <Carrito
          isOpen={carritoOpen}
          onClose={() => setCarritoOpen(false)}
        />
        <main>
          <Outlet />
        </main>
        <Footer />
      </CartProvider>
    </InteractionProvider>
  )
}

export default App
