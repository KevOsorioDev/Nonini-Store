import { Link } from 'react-router-dom'
import './ProductosPopulares.css'

const productos = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  nombre: `Producto ${i + 1}`,
}))

export const ProductosPopulares = () => {
  return (
    <section className="productos-populares flex items-center justify-center flex-col">
      
      <h3 className="productos-populares__title">
        Nuestros productos más populares
      </h3>

      <div className="productos-populares__grid flex flex-col gap-6 justify-center items-center">
        
        <div className="productos-populares__row flex justify-center gap-4">
          {productos.slice(0, 4).map(prod => (
            <Link
              key={prod.id}
              to="/producto"
              className="product-card productos-populares__card productos-populares__card--light"
            >
              {prod.nombre}
            </Link>
          ))}
        </div>
        
        <div className="productos-populares__row flex justify-center gap-4">
          {productos.slice(4, 8).map(prod => (
            <Link
              key={prod.id}
              to="/producto"    
              className="product-card productos-populares__card productos-populares__card--dark"
            >
              {prod.nombre}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}