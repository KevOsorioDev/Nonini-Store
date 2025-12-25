import { useState, useEffect, useRef } from 'react'
import './Carrousel.css'

const displays = [
  { 
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
          Diseños únicos<br />a tu medida
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-[var(--persian-plum-200)] max-w-2xl mb-6 md:mb-8">
          Bordados personalizados en remeras, buzos y más
        </p>
        <button className="px-6 md:px-8 py-3 md:py-4 bg-[var(--persian-plum-400)] text-white rounded-full text-base md:text-lg font-semibold hover:bg-[var(--persian-plum-500)] transition-all hover:scale-105">
          Explorá el catálogo
        </button>
      </div>
    )
  },
  { 
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
          Tu estilo,<br />tu diseño
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-[var(--persian-plum-200)] max-w-2xl mb-6 md:mb-8">
          Personalizá cada prenda con el logo que elijas
        </p>
        <button className="px-6 md:px-8 py-3 md:py-4 bg-[var(--persian-plum-400)] text-white rounded-full text-base md:text-lg font-semibold hover:bg-[var(--persian-plum-500)] transition-all hover:scale-105">
          Comenzar ahora
        </button>
      </div>
    )
  },
  { 
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
          Calidad premium<br />envíos rápidos
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-[var(--persian-plum-200)] max-w-2xl mb-6 md:mb-8">
          Recibí tu pedido en tiempo récord
        </p>
        <button className="px-6 md:px-8 py-3 md:py-4 bg-[var(--persian-plum-400)] text-white rounded-full text-base md:text-lg font-semibold hover:bg-[var(--persian-plum-500)] transition-all hover:scale-105">
          Ver más
        </button>
      </div>
    )
  }
]

export const Carrousel = () => {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const intervalRef = useRef(null)

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % displays.length)
        setFade(true)
      }, 700)
    }, 7000)
  }

  useEffect(() => {
    startInterval()
    return () => clearInterval(intervalRef.current)
  }, [])

  const manualChange = (newIndexFn) => {
    clearInterval(intervalRef.current)
    setFade(false)
    setTimeout(() => {
      setIndex(newIndexFn)
      setFade(true)
      startInterval()
    }, 700)
  }

  const goToPrev = () => {
    manualChange((prev) => (prev - 1 + displays.length) % displays.length)
  }

  const goToNext = () => {
    manualChange((prev) => (prev + 1) % displays.length)
  }

  return (
    <section className="carousel bg-[var(--persian-plum-950)]">
      
      <button 
        className={`carousel__button carousel__button--left ${fade ? '' : 'carousel__button--fading'}`}
        onClick={goToPrev}
      >
        <span className="carousel__arrow">←</span>
      </button>

      <div className={`carousel__content ${fade ? 'carousel__content--visible' : 'carousel__content--hidden'}`}>
        {displays[index].content}
      </div>

      <button 
        className={`carousel__button carousel__button--right ${fade ? '' : 'carousel__button--fading'}`}
        onClick={goToNext}
      >
        <span className="carousel__arrow">→</span>
      </button>
    </section>
  )
}