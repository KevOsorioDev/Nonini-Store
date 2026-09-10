import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productosService, resolverUrl } from '../../services/api'
import { DisenoPrendaLinks } from '../DisenoPrendaLinks/DisenoPrendaLinks'
import './ProductosPopulares.css'

export const ProductosPopulares = () => {
  const [productosMuestra, setProductosMuestra] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    productosService.obtenerTodos()
      .then((lista) => {
        const activos = (Array.isArray(lista) ? lista : []).filter((p) => p.activo !== false)
        setProductosMuestra(activos.slice(0, 8))
      })
      .catch(() => setProductosMuestra([]))
      .finally(() => setCargando(false))
  }, [])

  return (
    <section id="disenos-populares" className="productos-populares home-stack__panel home-stack__panel--2">
      <div className="home-stack__sheet">
      <span className="home-stack__index">02</span>
      <div className="home-stack__inner">
      <h2 className="home-section-title">Diseños populares</h2>

      {cargando ? (
        <p className="productos-populares__empty">Cargando diseños…</p>
      ) : productosMuestra.length === 0 ? (
        <div className="productos-populares__empty">
          <p>Todavía no hay diseños en el catálogo.</p>
          <Link to="/productos" className="productos-populares__cta">Ver catálogo</Link>
        </div>
      ) : (
        <div className="productos-populares__row">
          {productosMuestra.slice(0, 4).map((prod) => (
            <article key={prod.id} className="productos-populares__card">
              <Link to={`/producto/${prod.id}`} className="productos-populares__media">
                <img src={resolverUrl(prod.imagen || prod.imagenUrl || prod.disenoUrl)} alt={prod.nombre} />
                <div className="productos-populares__meta">
                  <h3>{prod.nombre}</h3>
                  <p>${Number(prod.precio).toLocaleString('es-AR')}</p>
                </div>
              </Link>
              <DisenoPrendaLinks productId={prod.id} />
            </article>
          ))}
        </div>
      )}
      </div>
      </div>
    </section>
  )
}
