import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Carrousel.css'

const slides = [
  {
    title: <>Diseños únicos<br />a tu medida</>,
    subtitle: 'Bordados personalizados en remeras, buzos y más',
    cta: 'Explorá el catálogo',
    to: '/productos'
  },
  {
    title: <>Tu estilo,<br />tu diseño</>,
    subtitle: 'Personalizá cada prenda con el logo que elijas',
    cta: 'Comenzar ahora',
    to: '/producto/1'
  },
  {
    title: <>Calidad premium<br />envíos rápidos</>,
    subtitle: 'Recibí tu pedido en tiempo récord',
    cta: 'Ver más',
    to: '#why-us'
  }
]

export const Carrousel = () => {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const intervalRef = useRef(null)
  const navigate = useNavigate()
  const slide = slides[index]

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length)
        setFade(true)
      }, 700)
    }, 7000)
  }

  const handleCta = () => {
    if (slide.to.startsWith('#')) {
      document.getElementById(slide.to.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate(slide.to)
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
    manualChange((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    manualChange((prev) => (prev + 1) % slides.length)
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
        <div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[var(--persian-plum-200)] max-w-2xl mb-6 md:mb-8">
            {slide.subtitle}
          </p>
          <button
            className="px-6 md:px-8 py-3 md:py-4 bg-[var(--persian-plum-400)] text-white rounded-full text-base md:text-lg font-semibold hover:bg-[var(--persian-plum-500)] transition-all hover:scale-105"
            onClick={handleCta}
          >
            {slide.cta}
          </button>
        </div>
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