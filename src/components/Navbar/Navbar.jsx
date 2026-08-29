import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DropDownButton, ButtonWithFunctions, useScrollEffect, UserIcon } from '../index'
import { HamburgerButton } from './HamburgerButton'
import { useCart } from '../../context/useCart'
import { authService, categoriasService, productosService } from '../../services/api'
import logo from '../../assets/images/nonini_logo.png'

import './Navbar.css'

export const Navbar = ({ hamburgerOpen, onHamburgerToggle, onCartOpen }) => {
  const transformed = useScrollEffect()
  const [user, setUser] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef(null)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const navigate = useNavigate()

  useEffect(() => {
    setUser(authService.getCurrentUser())
    cargarCategorias()
  }, [])

  // Cerrar búsqueda al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  // Búsqueda con debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      await buscarProductos()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

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

  const buscarProductos = async () => {
    if (searchQuery.trim().length < 2) return
    
    try {
      setSearchLoading(true)
      const resultados = await productosService.buscar(searchQuery)
      setSearchResults(resultados)
    } catch {
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/productos?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/login')
  }

  const opcionesCategorias = categorias.map(cat => ({
    label: cat.nombre,
    onClick: () => navigate(`/productos?categoria=${cat.id}`)
  }))

  return (
    <header className={`main-navbar ${transformed ? 'main-navbar--scrolled' : ''} flex items-center justify-center`}>
      <nav className="main-navbar__content">
        <div className="main-navbar__logo">
          <Link to='/'>
            <img src={logo} alt="Logo" className="main-navbar__logo-img" />
          </Link>
        </div>

        <div className="main-navbar__groups">
          <div className="main-navbar__center-menu text-2xl">
            <DropDownButton
              dropDownLabel="Nuestros diseños"
              options={opcionesCategorias}
              dropdownId="dropdown-disenos"
            />

            <DropDownButton
              dropDownLabel="Creá tu estilo"
              options={[
                { label: 'Remeras', onClick: () => navigate('/producto/1') },
                { label: 'Buzos', onClick: () => navigate('/producto/2') }
              ]}
              dropdownId="dropdown-estilo"
            />

            <DropDownButton
              dropDownLabel="Contactanos"
              options={[
                { label: 'Instagram', onClick: () => window.open('https://instagram.com', '_blank') },
                { label: 'Facebook', onClick: () => window.open('https://facebook.com', '_blank') }
              ]}
              dropdownId="dropdown-contacto"
            />
          </div>

          <div className="main-navbar__actions">
            {/* Búsqueda */}
            <div className="relative" ref={searchRef}>
              <ButtonWithFunctions
                variant="search"
                onClick={() => setSearchOpen(!searchOpen)}
              />
              
              {/* Modal de búsqueda */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  {/* Input de búsqueda */}
                  <form onSubmit={handleSearchSubmit} className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--persian-plum-600)] transition-colors"
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </form>

                  {/* Resultados */}
                  <div className="max-h-96 overflow-y-auto">
                    {searchLoading && (
                      <div className="p-4 text-center text-gray-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Buscando...
                      </div>
                    )}

                    {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <i className="fa-solid fa-search mr-2"></i>
                        No se encontraron productos
                      </div>
                    )}

                    {!searchLoading && searchResults.length > 0 && (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((producto) => (
                          <Link
                            key={producto.id}
                            to={`/producto/${producto.id}`}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                          >
                            <img
                              src={producto.imagenUrl || '/placeholder.png'}
                              alt={producto.nombre}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = '/placeholder.png'
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {producto.nombre}
                              </p>
                              <p className="text-sm text-[var(--persian-plum-600)] font-semibold">
                                ${producto.precio?.toFixed(2)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchQuery.trim().length < 2 && (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        Escribe al menos 2 caracteres para buscar
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <DropDownButton
                style={{marginRight: '0.3rem'}} // acerca el icono al carrito
                dropDownLabel={<UserIcon size={32} />}
                options={[
                  { label: 'Mi perfil', onClick: () => navigate('/perfil') },
                  { label: 'Mis órdenes', onClick: () => navigate('/ordenes') },
                  ...(user.rol === 'admin' ? [{ label: 'Panel Admin', onClick: () => navigate('/admin') }] : []),
                  { label: 'Cerrar sesión', onClick: handleLogout }
                ]}
                dropdownId="dropdown-usuario"
              />
            ) : (
              <ButtonWithFunctions
                text="Ingresar"
                onClick={() => navigate('/login')}
              />
            )}

            <div className="relative">
              <ButtonWithFunctions
                onClick={onCartOpen}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </ButtonWithFunctions>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-[var(--persian-plum-600)] text-white text-xs font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hamburguesa dentro del header para que se mueva con el scroll */}
        <HamburgerButton 
          isOpen={hamburgerOpen} 
          onToggle={onHamburgerToggle} 
        />
      </nav>
    </header>
  )
}