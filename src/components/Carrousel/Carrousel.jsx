import { useState, useEffect, useRef } from 'react'
import './Carrousel.css'

const displays = [
  { content: <div className="text-white text-3xl">Primer display</div> },
  { content: <div className="text-white text-3xl">Segundo display</div> },
  { content: <div className="text-white text-3xl">Tercer display</div> }
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