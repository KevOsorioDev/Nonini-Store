import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { productosService, categoriasService, resolverUrl } from '../services/api'
import { DisenoPrendaLinks } from '../components/DisenoPrendaLinks/DisenoPrendaLinks'
import { lenis } from '../lenis.js'
import './CategoriaPage.css'

const DESKTOP_MQ = '(min-width: 1024px)'

const ProductoCard = ({ producto }) => (
  <article className="catalogo-card">
    <Link to={`/producto/${producto.id}`} className="catalogo-card__main">
      <div className="catalogo-card__img">
        <img
          src={resolverUrl(producto.imagenUrl || producto.imagen)}
          alt={producto.nombre}
          draggable="false"
        />
      </div>
      <h3 className="catalogo-card__nombre">{producto.nombre}</h3>
      {producto.descripcion && (
        <p className="catalogo-card__desc">{producto.descripcion}</p>
      )}
      <p className="catalogo-card__precio">
        ${Number(producto.precio).toLocaleString('es-AR')}
      </p>
    </Link>
    <DisenoPrendaLinks productId={producto.id} />
  </article>
)

const Vacio = ({ texto, compacto }) => (
  <div className={`catalogo-vacio${compacto ? ' catalogo-vacio--seccion' : ''}`}>
    <p>{texto}</p>
    <Link to="/personalizar" className="catalogo-vacio__cta">
      Crear mi diseño
    </Link>
  </div>
)

const CategoriaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaId = searchParams.get('categoria')
  const searchQuery = searchParams.get('q')
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [seccionIndex, setSeccionIndex] = useState(0)
  const [fase, setFase] = useState('in')
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches
  )

  const lockRef = useRef(false)
  const rowRef = useRef(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false
  })
  const seccionIndexRef = useRef(0)
  const seccionesRef = useRef([])

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const [cats, prods] = await Promise.all([
          categoriasService.obtenerTodas(),
          searchQuery
            ? productosService.buscar(searchQuery)
            : productosService.obtenerTodos()
        ])
        setCategorias(Array.isArray(cats) ? cats : [])
        setProductos(Array.isArray(prods) ? prods : prods?.productos || [])
      } catch {
        setCategorias([])
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    cargarCatalogo()
  }, [searchQuery])

  const seccionesBase = categorias.map((categoria) => ({
    ...categoria,
    productos: productos.filter((producto) =>
      producto.activo !== false && (
        String(producto.categoriaId) === String(categoria.id) ||
        String(producto.categoria?.id) === String(categoria.id)
      )
    )
  }))

  const sinCategoria = productos.filter((producto) =>
    producto.activo !== false && !producto.categoriaId && !producto.categoria?.id
  )

  const secciones = sinCategoria.length > 0
    ? [...seccionesBase, { id: 'otros', nombre: 'Otros diseños', productos: sinCategoria }]
    : seccionesBase

  seccionIndexRef.current = seccionIndex
  seccionesRef.current = secciones

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (loading || secciones.length === 0) return
    if (!categoriaId) {
      setSeccionIndex(0)
      return
    }
    const idx = secciones.findIndex((s) => String(s.id) === String(categoriaId))
    setSeccionIndex(idx >= 0 ? idx : 0)
  }, [loading, categoriaId, categorias, productos])

  const irASeccion = useCallback((siguiente) => {
    const list = seccionesRef.current
    if (lockRef.current) return
    if (siguiente < 0 || siguiente >= list.length) return
    if (siguiente === seccionIndexRef.current) return

    lockRef.current = true
    setFase('out')

    window.setTimeout(() => {
      setSeccionIndex(siguiente)
      seccionIndexRef.current = siguiente
      setFase('in')
      const seccion = list[siguiente]
      if (seccion) {
        const params = { categoria: String(seccion.id) }
        if (searchQuery) params.q = searchQuery
        setSearchParams(params, { replace: true })
      }
      if (rowRef.current) rowRef.current.scrollLeft = 0
      window.scrollTo(0, 0)
      window.setTimeout(() => {
        lockRef.current = false
      }, 480)
    }, 280)
  }, [searchQuery, setSearchParams])

  const esUltimaSeccion = secciones.length > 0 && seccionIndex >= secciones.length - 1

  useEffect(() => {
    if (!isDesktop) return

    if (esUltimaSeccion) {
      lenis?.start()
    } else {
      window.scrollTo(0, 0)
      lenis?.scrollTo(0, { immediate: true })
      lenis?.stop()
    }

    return () => {
      lenis?.start()
    }
  }, [isDesktop, esUltimaSeccion])

  useEffect(() => {
    if (!isDesktop || loading || secciones.length === 0) return

    const onWheel = (event) => {
      const row = rowRef.current
      const overRow = row && (row === event.target || row.contains(event.target))

      if (overRow && row.scrollWidth > row.clientWidth + 2) {
        const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        const delta = horizontal ? event.deltaX : event.deltaY
        const atStart = row.scrollLeft <= 0
        const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2
        const puedeMover = (delta < 0 && !atStart) || (delta > 0 && !atEnd) || horizontal
        if (puedeMover) {
          event.preventDefault()
          event.stopPropagation()
          row.scrollLeft += delta
          return
        }
      }

      const list = seccionesRef.current
      const actual = seccionIndexRef.current
      const esUltima = actual >= list.length - 1
      const scrollY = window.scrollY || document.documentElement.scrollTop

      if (esUltima && event.deltaY > 0) return
      if (esUltima && event.deltaY < 0 && scrollY > 8) return

      event.preventDefault()
      if (Math.abs(event.deltaY) < 12) return

      const siguiente = event.deltaY > 0 ? actual + 1 : actual - 1
      irASeccion(siguiente)
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => window.removeEventListener('wheel', onWheel, { capture: true })
  }, [isDesktop, loading, secciones.length, irASeccion])

  useEffect(() => {
    if (!isDesktop) return

    const onMove = (event) => {
      if (!dragRef.current.active || !rowRef.current) return
      const dx = event.clientX - dragRef.current.startX
      if (Math.abs(dx) <= 8) return
      dragRef.current.moved = true
      rowRef.current.scrollLeft = dragRef.current.startScroll - dx
    }

    const onUp = () => {
      dragRef.current.active = false
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [isDesktop, seccionIndex])

  useEffect(() => {
    if (loading || !categoriaId || isDesktop) return
    const seccion = document.getElementById(`categoria-${categoriaId}`)
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading, categoriaId, categorias, isDesktop])

  const onPointerDown = (event) => {
    if (!rowRef.current) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: rowRef.current.scrollLeft,
      moved: false
    }
  }

  const onRowClickCapture = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragRef.current.moved = false
    }
  }

  const onRowDragStart = (event) => {
    event.preventDefault()
  }

  const seccionActual = secciones[seccionIndex] || secciones[0]
  const titulo = searchQuery ? `Resultados para “${searchQuery}”` : 'Nuestros diseños'

  if (loading) {
    return (
      <div className="catalogo-page catalogo-page--estado">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-900)]" />
      </div>
    )
  }

  if (secciones.length === 0) {
    return (
      <div className="catalogo-page catalogo-page--estado">
        <Vacio
          texto={searchQuery
            ? 'No encontramos diseños con esa búsqueda.'
            : 'Todavía no hay diseños en el catálogo. Mientras tanto podés crear el tuyo.'}
        />
      </div>
    )
  }

  return (
    <div className="catalogo-page">
      <div className="catalogo-mobile lg:hidden">
        <header className="catalogo-page__header">
          <h1 className="catalogo-page__titulo">{titulo}</h1>
        </header>
        <div className="catalogo-mobile__secciones">
          {secciones.map((seccion) => (
            <section
              key={seccion.id}
              id={`categoria-${seccion.id}`}
              className="catalogo-mobile__seccion"
            >
              <h2 className="catalogo-mobile__categoria">{seccion.nombre}</h2>
              {seccion.productos.length === 0 ? (
                <Vacio compacto texto={`Todavía no hay diseños en ${seccion.nombre}.`} />
              ) : (
                <div className="catalogo-grid">
                  {seccion.productos.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="catalogo-desktop hidden lg:flex">
        {seccionActual && (
          <div className={`catalogo-desktop__viewport catalogo-seccion catalogo-seccion--${fase}`}>
            <h2 className="catalogo-desktop__titulo">
              {searchQuery ? titulo : seccionActual.nombre}
            </h2>
            {secciones.length > 1 && (
              <div className="catalogo-tabs">
                {secciones.map((seccion, index) => (
                  <button
                    key={seccion.id}
                    type="button"
                    className={`catalogo-tab${index === seccionIndex ? ' is-active' : ''}`}
                    onClick={() => irASeccion(index)}
                  >
                    {seccion.nombre}
                  </button>
                ))}
              </div>
            )}
            {secciones.length > 1 && (
              <div className="catalogo-progress" aria-hidden="true">
                <div className="catalogo-progress__track">
                  <div
                    className="catalogo-progress__thumb"
                    style={{
                      width: `${100 / secciones.length}%`,
                      transform: `translateX(${seccionIndex * 100}%)`
                    }}
                  />
                </div>
              </div>
            )}
            {seccionActual.productos.length === 0 ? (
              <Vacio compacto texto={`Todavía no hay diseños en ${seccionActual.nombre}.`} />
            ) : (
              <div
                ref={rowRef}
                className="catalogo-row"
                data-lenis-prevent
                onPointerDown={onPointerDown}
                onClickCapture={onRowClickCapture}
                onDragStart={onRowDragStart}
              >
                {seccionActual.productos.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriaPage
