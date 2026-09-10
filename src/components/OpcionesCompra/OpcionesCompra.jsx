import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoriasService } from '../../services/api'
import { lenis } from '../../lenis.js'
import './OpcionesCompra.css'
import curlyArrow from '../../assets/images/curly_arrow.png'

export const OpcionesCompra = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const [activeLink, setActiveLink] = useState(null)
  const [categorias, setCategorias] = useState([])
  const leaveTimer = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      window.clearTimeout(leaveTimer.current)
    }
  }, [])

  useEffect(() => {
    categoriasService.obtenerTodas()
      .then((lista) => {
        if (Array.isArray(lista) && lista.length > 0) setCategorias(lista)
      })
      .catch(() => {})
  }, [])

  const elegirCatalogo = () => navigate('/productos')
  const irACategoria = (cat) => navigate(`/productos?categoria=${cat.slug || cat.id}`)
  const elegirCrear = () => navigate('/personalizar')
  const irAPopulares = (event) => {
    event.preventDefault()
    const destino = document.getElementById('disenos-populares')
    if (!destino) return
    window.clearTimeout(leaveTimer.current)
    setActiveLink(null)
    lenis.scrollTo(destino, { offset: 0, duration: 1.05 })
  }
  const abrir = (n) => {
    window.clearTimeout(leaveTimer.current)
    setActiveLink(n)
  }
  const cerrarVentana = () => {
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setActiveLink(null), 140)
  }

  return (
    <section
      ref={sectionRef}
      className={`opciones-compra home-stack__panel home-stack__panel--1 ${activeLink ? 'has-active' : ''} ${isVisible ? 'visible' : ''}`}
    >
      <div className="home-stack__sheet">
        <span className="home-stack__index">01</span>
        <div className="home-stack__inner">
          <h2 className="home-section-title opciones-compra__title">
            ¿Cómo querés arrancar?
          </h2>

          <div
            className={`opciones-compra__options ${activeLink ? 'has-overlay-active' : ''}`}
            onMouseLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) cerrarVentana()
            }}
          >
            <div className="opciones-compra__choice" onMouseEnter={() => abrir(1)}>
              <img src={curlyArrow} className="curly-arrow arrow-left" alt="" />
              <button
                type="button"
                className={`opciones-compra__link ${activeLink === 1 ? 'active' : ''}`}
                onClick={elegirCatalogo}
                onMouseEnter={() => abrir(1)}
              >
                Quiero usar un diseño ya creado
              </button>
              <div className="opciones-compra__cats opciones-compra__cats--mobile">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="opciones-compra__cat"
                    onClick={() => irACategoria(cat)}
                  >
                    {cat.nombre}
                  </button>
                ))}
                <button
                  type="button"
                  className="opciones-compra__cat opciones-compra__cat--all"
                  onClick={elegirCatalogo}
                >
                  Ver todo
                </button>
              </div>
            </div>

            <div className="opciones-compra__choice opciones-compra__choice--crear" onMouseEnter={() => abrir(2)}>
              <img src={curlyArrow} className="curly-arrow arrow-right" alt="" />
              <button
                type="button"
                className={`opciones-compra__link ${activeLink === 2 ? 'active' : ''}`}
                onClick={elegirCrear}
                onMouseEnter={() => abrir(2)}
              >
                Quiero crear uno nuevo
              </button>
              <p className="opciones-compra__mobile-note">
                Subí tu archivo, elegí remera o buzo y lo bordamos a pedido.
              </p>
              <button type="button" className="opciones-compra__mobile-cta" onClick={elegirCrear}>
                Ir a personalizar
              </button>
            </div>

            <div
              className={`hover-overlay left-overlay ${activeLink === 1 ? 'active' : ''}`}
              onMouseEnter={() => abrir(1)}
            >
              <div className="overlay-panel">
                <p className="overlay-text">Revisá nuestro catálogo</p>
                <div className="opciones-compra__overlay-actions">
                  <a
                    href="#disenos-populares"
                    className="overlay-cta overlay-cta--secondary"
                    onClick={irAPopulares}
                  >
                    Ver los diseños más pedidos
                  </a>
                  <button
                    type="button"
                    className="overlay-cta overlay-cta--primary"
                    onClick={elegirCatalogo}
                  >
                    Ver todo el catálogo
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`hover-overlay right-overlay ${activeLink === 2 ? 'active' : ''}`}
              onMouseEnter={() => abrir(2)}
            >
              <div className="overlay-panel overlay-panel--crear">
                <p className="overlay-text overlay-text--lg">¿Te sentís creativo y querés enviar tu diseño?</p>
                <p className="overlay-desc">
                  Subí tu diseño, elegí remera o buzo y ubicalo en la prenda. El tamaño se regula en centímetros y lo bordamos a pedido.
                </p>
                <button type="button" className="overlay-cta" onClick={elegirCrear}>
                  Ir a personalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
