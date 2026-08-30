import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { productosService } from '../../services/api'
import { DisenoPrendaLinks } from '../DisenoPrendaLinks/DisenoPrendaLinks'
import './ProductosPopulares.css'

export const ProductosPopulares = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [productosMuestra, setProductosMuestra] = useState([])
  const sectionRef = useRef(null)

  useEffect(() => {
    productosService.obtenerTodos()
      .then((lista) => {
        const activos = (Array.isArray(lista) ? lista : []).filter((p) => p.activo !== false)
        setProductosMuestra(activos.slice(0, 8))
      })
      .catch(() => setProductosMuestra([]))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    const animar = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const prog = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.5)))
      const anchoVw = 75 + 25 * prog

      el.style.width = `${anchoVw}vw`
      el.style.maxWidth = `${anchoVw}vw`
      if (anchoVw >= 99.9) {
        el.style.marginInline = '0'
      } else {
        el.style.marginInline = 'auto'
      }
    }

    window.addEventListener('scroll', animar, { passive: true })
    animar()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', animar)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ marginBottom: '3.5rem' }}
      className={`productos-populares ${isVisible ? 'visible' : ''}`}
    >
      <h3 className="productos-populares__title">
        Nuestros diseños más populares
      </h3>

      <div className="productos-populares__grid">
        <div className="productos-populares__row">
          {productosMuestra.slice(0, 5).map((prod) => (
            <article
              key={prod.id}
              className="productos-populares__card productos-populares__card--light"
            >
              <Link to={`/producto/${prod.id}`} className="productos-populares__card-main">
                <img src={prod.imagen || prod.imagenUrl || prod.disenoUrl} alt={prod.nombre} />
                <h4>{prod.nombre}</h4>
                <p>${prod.precio.toLocaleString()}</p>
              </Link>
              <DisenoPrendaLinks productId={prod.id} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
