import { useRef } from 'react'

const productos = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  nombre: `Producto ${i + 1}`,
}))

export const ProductosPopulares = () => {
  const scrollRef = useRef(null)

  // Scroll infinito simple: cuando llegas al final, vuelve al inicio
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollLeft + el.offsetWidth >= el.scrollWidth - 1) {
      el.scrollLeft = 0
    }
    if (el.scrollLeft === 0) {
      el.scrollLeft = el.scrollWidth - el.offsetWidth
    }
  }

  return (
    <section className="
      w-full max-w-[90vw] mx-auto mt-12
      flex flex-col items-center
    ">
      <h3 className="
        text-3xl font-bold mb-8
        text-[var(--persian-plum-900)]
      ">
        Nuestros productos más populares
      </h3>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
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
          {productos.slice(0, 8).map(prod => (
            <div
              key={prod.id}
              className="
                w-[200px] h-[200px]
                bg-[var(--persian-plum-300)]
                rounded-xl
                flex items-center justify-center
                text-lg font-semibold
                text-[var(--persian-plum-900)]
                shrink-0
              "
            >
              {prod.nombre}
            </div>
          ))}
        </div>
        {/* Segunda fila */}
        <div className="flex gap-4">
          {productos.slice(8, 16).map(prod => (
            <div
              key={prod.id}
              className="
                w-[200px] h-[200px]
                bg-[var(--persian-plum-400)]
                rounded-xl
                flex items-center justify-center
                text-lg font-semibold
                text-[var(--persian-plum-50)]
                shrink-0
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