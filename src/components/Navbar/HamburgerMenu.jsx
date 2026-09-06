import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import { authService } from '../../services/api'
import { useSitio } from '../../context/SitioContext'
import { linkWhatsapp } from '../../data/sitioDefaults'
import './HamburgerMenu.css'

export const HamburgerMenu = ({ categorias, onCartOpen, isOpen, onClose }) => {
  const [user, setUser] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const navigate = useNavigate()
  const { sitio } = useSitio()
  const whatsapp = linkWhatsapp(sitio.whatsapp)

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [])

  useEffect(() => {
    // Bloquear scroll del body cuando el menú está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLogout = () => {
    authService.logout()
    onClose()
  }

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  const handleExternalLink = (url) => {
    window.open(url, '_blank')
    onClose()
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const opcionesCategorias = (categorias || []).length > 0
    ? categorias.map(cat => ({
        label: cat.nombre,
        onClick: () => handleNavigate(`/productos?categoria=${cat.id}`)
      }))
    : [{ label: 'Ver catálogo', onClick: () => handleNavigate('/productos') }]

  return (
    <>
      {/* Overlay */}
      <div 
        className={`hamburger-overlay ${isOpen ? 'hamburger-overlay--visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer Menu - Desliza desde la derecha */}
      <nav className={`hamburger-drawer ${isOpen ? 'hamburger-drawer--open' : ''}`}>
        {/* Header del Drawer */}
        <div className="hamburger-drawer__header">
          <span className="hamburger-drawer__title">Menú</span>
          <button 
            className="hamburger-drawer__close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Contenido del Drawer */}
        <div className="hamburger-drawer__content">
          {/* Sección: Nuestros Diseños */}
          <div className="hamburger-section">
            <button 
              className={`hamburger-section__header ${expandedSection === 'disenos' ? 'hamburger-section__header--active' : ''}`}
              onClick={() => toggleSection('disenos')}
            >
              <span>Nuestros diseños</span>
              <i className={`fa-solid fa-chevron-down hamburger-section__icon ${expandedSection === 'disenos' ? 'hamburger-section__icon--rotated' : ''}`}></i>
            </button>
            <div className={`hamburger-section__content ${expandedSection === 'disenos' ? 'hamburger-section__content--open' : ''}`}>
              {opcionesCategorias.map((option, index) => (
                <button 
                  key={index}
                  className="hamburger-section__item"
                  onClick={option.onClick}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sección: Creá tu estilo */}
          <div className="hamburger-section">
            <button 
              className={`hamburger-section__header ${expandedSection === 'estilo' ? 'hamburger-section__header--active' : ''}`}
              onClick={() => toggleSection('estilo')}
            >
              <span>Creá tu estilo</span>
              <i className={`fa-solid fa-chevron-down hamburger-section__icon ${expandedSection === 'estilo' ? 'hamburger-section__icon--rotated' : ''}`}></i>
            </button>
            <div className={`hamburger-section__content ${expandedSection === 'estilo' ? 'hamburger-section__content--open' : ''}`}>
              <button className="hamburger-section__item" onClick={() => handleNavigate('/personalizar?prenda=Remera')}>
                Remeras
              </button>
              <button className="hamburger-section__item" onClick={() => handleNavigate('/personalizar?prenda=Buzo')}>
                Buzos
              </button>
            </div>
          </div>

          {(sitio.instagram || sitio.facebook || whatsapp || sitio.email) && (
          <div className="hamburger-section">
            <button
              className={`hamburger-section__header ${expandedSection === 'contacto' ? 'hamburger-section__header--active' : ''}`}
              onClick={() => toggleSection('contacto')}
            >
              <span>Contactanos</span>
              <i className={`fa-solid fa-chevron-down hamburger-section__icon ${expandedSection === 'contacto' ? 'hamburger-section__icon--rotated' : ''}`}></i>
            </button>
            <div className={`hamburger-section__content ${expandedSection === 'contacto' ? 'hamburger-section__content--open' : ''}`}>
              {sitio.instagram && (
                <button className="hamburger-section__item" onClick={() => handleExternalLink(sitio.instagram)}>
                  <i className="fa-brands fa-instagram"></i> Instagram
                </button>
              )}
              {sitio.facebook && (
                <button className="hamburger-section__item" onClick={() => handleExternalLink(sitio.facebook)}>
                  <i className="fa-brands fa-facebook"></i> Facebook
                </button>
              )}
              {whatsapp && (
                <button className="hamburger-section__item" onClick={() => handleExternalLink(whatsapp)}>
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
              )}
              {sitio.email && (
                <button className="hamburger-section__item" onClick={() => { window.location.href = `mailto:${sitio.email}`; onClose() }}>
                  <i className="fa-regular fa-envelope"></i> Email
                </button>
              )}
            </div>
          </div>
          )}

          {/* Separador */}
          <div className="hamburger-divider"></div>

          {/* Acciones rápidas */}
          <div className="hamburger-actions">
            {/* Carrito */}
            <button 
              className="hamburger-action-btn"
              onClick={() => {
                onCartOpen()
                onClose()
              }}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Carrito</span>
              {cartCount > 0 && (
                <span className="hamburger-action-btn__badge">{cartCount}</span>
              )}
            </button>

            {/* Usuario */}
            {user ? (
              <>
                <button className="hamburger-action-btn" onClick={() => handleNavigate('/perfil')}>
                  <i className="fa-solid fa-user"></i>
                  <span>Mi perfil</span>
                </button>
                <button className="hamburger-action-btn" onClick={() => handleNavigate('/ordenes')}>
                  <i className="fa-solid fa-box"></i>
                  <span>Mis órdenes</span>
                </button>
                {user.rol === 'admin' && (
                  <button className="hamburger-action-btn" onClick={() => handleNavigate('/admin')}>
                    <i className="fa-solid fa-gear"></i>
                    <span>Panel Admin</span>
                  </button>
                )}
                <button className="hamburger-action-btn hamburger-action-btn--logout" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <button className="hamburger-action-btn hamburger-action-btn--primary" onClick={() => handleNavigate('/login')}>
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Ingresar</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
