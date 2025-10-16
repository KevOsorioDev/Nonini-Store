import { useState, useEffect, useRef } from 'react'

import '../../index.css'

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

  // Función para cambio manual y reinicio de intervalo
  const manualChange = (newIndexFn) => {
    clearInterval(intervalRef.current)
    setFade(false)
    setTimeout(() => {
      setIndex(newIndexFn)
      setFade(true)
      startInterval() // Reinicia el contador automático
    }, 700)
  }

  const goToPrev = () => {
    manualChange((prev) => (prev - 1 + displays.length) % displays.length)
  }

  const goToNext = () => {
    manualChange((prev) => (prev + 1) % displays.length)
  }

  const buttonClass = `
  group absolute top-1/2 -translate-y-1/2 px-6 py-5 rounded-full
  text-[var(--persian-plum-400)] text-3xl font-black
  bg-transparent shadow-lg
  backdrop-blur-[16px] backdrop-saturate-[180%] opacity-70
  hover:text-[var(--persian-plum-950)] hover:scale-[1.1] transition-all duration-200
  `;

  return(
    <section className="relative mx-auto mt-[13vh]

                        h-[75vh] w-[85vw] rounded-2xl

                        bg-(--persian-plum-950)"
    >
      <button className={`left-[2%] ${buttonClass}
                          ${fade ? "opacity-100" : "opacity-50"}`}
              onClick={goToPrev}
      >
        <span className='inline-block transition-transform duration-200 group-hover:scale-[1.3]'>
          &#8592;
        </span>
      </button>
      <div
        className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}
      >
        {displays[index].content}
      </div>
      <button className={`right-[2%] ${buttonClass}
                          ${fade ? "opacity-100" : "opacity-50"}`}
        onClick={goToNext}
      >
        <span className='inline-block transition-transform duration-200 group-hover:scale-[1.3]'>
          &#8594;
        </span>
      </button>
    </section>
  )
}