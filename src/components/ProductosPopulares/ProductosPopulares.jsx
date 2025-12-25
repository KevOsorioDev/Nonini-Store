import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productosService } from '../../services/api'
import './ProductosPopulares.css'

export const ProductosPopulares = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      const data = await productosService.obtenerTodos()
      // Mezclar productos aleatoriamente para variedad
      const shuffled = [...data].sort(() => Math.random() - 0.5)
      setProductos(shuffled)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="productos-populares flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-900)]"></div>
      </section>
    )
  }

  return (
    <section className="productos-populares flex items-center justify-center flex-col">
      
      <h3 className="productos-populares__title">
        Nuestros Mejores Diseños
      </h3>

      <div className="productos-populares__grid flex flex-col gap-6 justify-center items-center">
        
        {/* Primera fila - 4 productos */}
        <div className="productos-populares__row flex justify-center gap-4">
          {productos.slice(0, 4).map(prod => (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}
              className="product-card productos-populares__card productos-populares__card--light"
            >
              <div className="flex flex-col items-center gap-2 p-4">
                <img 
                  src={prod.imagenUrl || '/images/placeholder.png'} 
                  alt={prod.nombre}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
                <h4 className="font-semibold text-center">{prod.nombre}</h4>
                <p className="text-lg font-bold">${prod.precio.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Segunda fila - 4 productos */}
        <div className="productos-populares__row flex justify-center gap-4">
          {productos.slice(4, 8).map(prod => (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}    
              className="product-card productos-populares__card productos-populares__card--dark"
            >
              <div className="flex flex-col items-center gap-2 p-4">
                <img 
                  src={prod.imagenUrl || '/images/placeholder.png'} 
                  alt={prod.nombre}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
                <h4 className="font-semibold text-center text-white">{prod.nombre}</h4>
                <p className="text-lg font-bold text-white">${prod.precio.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {productos.length === 0 && (
        <p className="text-gray-500 mt-8">No hay productos disponibles en este momento</p>
      )}
    </section>
  )
}