import { useState, useEffect, useRef } from 'react'
import './PorQueElegirnos.css'

const reasons = [
  {
    id: 1,
    text: '¡Diseñamos lo que más te guste! Al poder basarnos en los diseños que nos mandan los clientes, nos aseguramos de que tu prenda quede como vos la imagines.',
    variant: 'primary'
  },
  {
    id: 2,
    text: 'Nuestras prendas utilizan materiales basados en 100% algodón, por lo que son de la mejor calidad.',
    variant: 'secondary'
  },
  {
    id: 3,
    text: 'Cada prenda se trabaja a pedido. Cuidamos los detalles del bordado y te acompañamos en el proceso para que el resultado sea exactamente el que imaginaste.',
    variant: 'tertiary'
  }
]

export const PorQueElegirnos = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    const animar = () => {
      const el = sectionRef.current
      if (!el) return

      const vh = window.innerHeight
      const rectTop = el.getBoundingClientRect().top
      const prog = Math.max(0, Math.min(1, (vh - rectTop) / (vh * 0.5)))
      const anchoVw = 75 + 25 * prog

      el.style.width = `${anchoVw}vw`
      el.style.maxWidth = `${anchoVw}vw`
    }

    window.addEventListener('scroll', animar, { passive: true })
    animar()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', animar)
    }
  }, [])

  return (
    <section id="why-us" ref={sectionRef} className={`why-us flex flex-col items-center justify-center ${isVisible ? 'visible' : ''}`}>
      <h3 className="why-us__title">
        ¿Por qué elegirnos?
      </h3>

      <div className="why-us__grid flex gap-14 justify-center items-center">
        {reasons.map(reason => (
          <div 
            key={reason.id}
            className={`why-us__card why-us__card--${reason.variant}`}
          >
            {reason.text}
          </div>
        ))}
      </div>
    </section>
  )
}