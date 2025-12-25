import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DropDownButton, ButtonWithFunctions, useScrollEffect } from '../index'
import { Carrito } from '../Carrito/Carrito'
import { useCart } from '../../context/useCart'
import { authService, categoriasService } from '../../services/api'
import logo from '../../assets/images/nonini_logo.png'
import './Navbar.css'

export const Navbar = () => {
  const transformed = useScrollEffect()
  const [carritoOpen, setCarritoOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [categorias, setCategorias] = useState([])
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const navigate = useNavigate()

  useEffect(() => {
    setUser(authService.getCurrentUser())
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      const data = await categoriasService.obtenerTodas()
      setCategorias(data)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      // Usar categorías por defecto si falla
      setCategorias([
        { id: 1, nombre: 'Nike', slug: 'nike' },
        { id: 2, nombre: 'Mascotas', slug: 'mascotas' },
        { id: 3, nombre: 'Disney/Pixar', slug: 'disney-pixar' }
      ])
    }
  }

  const handleLogout = () => {
    authService.logout()
  }

  // Convertir categorías a opciones de dropdown
  const opcionesCategorias = categorias.map(cat => ({
    label: cat.nombre,
    onClick: () => navigate(`/productos?categoria=${cat.id}`)
  }))

  return (
    <header className={`navbar ${transformed ? 'navbar--scrolled' : ''} ${menuOpen ? 'menu-open' : ''} flex items-center justify-center`}>
      
      <nav className="navbar__content">
        
        {/* Botón hamburguesa: se muestra en md/sm a la izquierda */}
        <button
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="navbar__burger"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span className={`navbar__burger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`navbar__burger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`navbar__burger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className="navbar__groups">
          <div className="navbar__center-menu text-2xl">
            <DropDownButton
              dropDownLabel="Nuestros diseños"
              options={opcionesCategorias}
            />

            <DropDownButton
              dropDownLabel="Creá tu estilo"
              options={[
                { label: 'Remeras', onClick: () => navigate('/producto/1') },
                { label: 'Buzos', onClick: () => navigate('/producto/2') }
              ]}
            />

            <DropDownButton
              dropDownLabel="Contactanos"
              options={[
                { label: 'Instagram', onClick: () => window.open('https://instagram.com', '_blank') },
                { label: 'Facebook', onClick: () => window.open('https://facebook.com', '_blank') }
              ]}
            />
          </div>

          <div className="navbar__actions">
            <ButtonWithFunctions
              variant="search"
              onClick={() => console.log('Buscar')}
            />

            {user ? (
              <DropDownButton
                dropDownLabel={user.nombre}
                options={[
                  { label: 'Mi perfil', onClick: () => console.log('Perfil') },
                  { label: 'Mis órdenes', onClick: () => console.log('Órdenes') },
                  ...(user.rol === 'admin' ? [{ label: 'Panel Admin', onClick: () => navigate('/admin') }] : []),
                  { label: 'Cerrar sesión', onClick: handleLogout }
                ]}
              />
            ) : (
              <ButtonWithFunctions
                text="Ingresar"
                onClick={() => navigate('/login')}
              />
            )}

            <div className="relative">
              <ButtonWithFunctions
                text="Carrito"
                onClick={() => setCarritoOpen(true)}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-[var(--persian-plum-600)] text-white text-xs font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="navbar__logo">
          <Link to='/'>
            <img src={logo} alt="Logo" className="navbar__logo-img" />
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <button
          className="navbar__backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <Carrito 
        isOpen={carritoOpen} 
        onClose={() => setCarritoOpen(false)} 
      />
    </header>
  )
}