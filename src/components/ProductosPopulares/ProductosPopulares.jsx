import { useRef } from 'react'

const productos = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  nombre: `Producto ${i + 1}`,
}))

export const ProductosPopulares = () => {
  const scrollRef = useRef(null)

  // Eliminado el infinite scrolling

  return (
    <section className="
      flex items-center justify-center flex-col mt-60
      w-full max-w-[85vw] mx-auto pb-10
    ">
      <h3 className="
        text-3xl font-bold mb-8
        text-[var(--persian-plum-900)]
      ">
        Nuestros productos más populares
      </h3>
      <div
        ref={scrollRef}
        className="
          w-full
          overflow-x-auto
          whitespace-nowrap
          scrollbar-thin scrollbar-thumb-[var(--persian-plum-400)]
          flex flex-col gap-6
        "
        style={{ maxWidth: '90vw' }}
      >
        {/* Primera fila */}
        <div className="flex gap-4 mb-4">
          {productos.slice(0, 6).map(prod => (
            <div
              key={prod.id}
              className="
                product-card
                bg-[var(--persian-plum-300)]
                text-[var(--persian-plum-900)]
              "
            >
              {prod.nombre}
            </div>
          ))}
        </div>
        {/* Segunda fila */}
        <div className="flex gap-4">
          {productos.slice(6, 12).map(prod => (
            <div
              key={prod.id}
              className="
                product-card
                bg-[var(--persian-plum-400)]
                text-[var(--persian-plum-50)]
              "
            >
              {prod.nombre}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}