import { useEffect, useState } from 'react'
import { StarIcon } from '../icons/star/StarIcon'
import './Instrucciones.css'

import NoniniLogo from '../../assets/images/nonini_logo.png'
import NoniniLogoBlink from '../../assets/images/nonini_blink.png'
import NoniniStars from '../../assets/images/nonini_stars.png'

export const Instrucciones = () => {
  const [scrolled, setScrolled] = useState(false)
  const [blink, setBlink] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisible2, setIsVisible2] = useState(false)
  const [isVisible3, setIsVisible3] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [starsReturning, setStarsReturning] = useState(false)
  const [firstAppear, setFirstAppear] = useState(true)
  const [showBlink, setShowBlink] = useState(false)
  const [isVisible4, setIsVisible4] = useState(false)
  const [isLogoVisible, setIsLogoVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let interval
    if (scrolled) {
      interval = setInterval(() => setBlink(b => !b), 400)
    } else {
      setBlink(false)
    }
    return () => clearInterval(interval)
  }, [scrolled])

  useEffect(() => {
    let timeout
    if (isVisible3) {
      if (!showBlink) {
        timeout = setTimeout(() => setShowBlink(true), 3000)
      } else {
        timeout = setTimeout(() => setShowBlink(false), 1000)
      }
    }
    return () => clearTimeout(timeout)
  }, [showBlink, isVisible3])

  useEffect(() => {
    let t1, t2, t3
    let mounted = true

    function starsLoop() {
      if (!mounted) return
      t1 = setTimeout(() => {
        if (!mounted) return
        setShowStars(true)
        setStarsReturning(false)
        t2 = setTimeout(() => {
          if (!mounted) return
          setStarsReturning(true)
          t3 = setTimeout(() => {
            if (!mounted) return
            setShowStars(false)
            setStarsReturning(false)
            setTimeout(() => {
              setShowBlink(false)
            }, 500)
            t1 = setTimeout(starsLoop, 8000)
          }, 2000)
        }, 5000)
      }, 8000)
    }

    starsLoop()
    return () => {
      mounted = false
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    const containerRef = document.querySelector('.instructions')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setTimeout(() => setIsVisible2(true), 400)
            setTimeout(() => setIsVisible3(true), 1200)
            setTimeout(() => {
              setIsVisible4(true)
              setIsLogoVisible(true)
              setFirstAppear(true)
              setTimeout(() => setFirstAppear(false), 500)
            }, 3100)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    )
    if (containerRef) {
      observer.observe(containerRef)
    }
    return () => observer.disconnect()
  }, [])

  const stars = [
    { key: 'left-1', blinkOn: true },
    { key: 'left-2', blinkOn: false },
    { key: 'left-3', blinkOn: true },
    { key: 'right-1', blinkOn: false },
    { key: 'right-2', blinkOn: true },
    { key: 'right-3', blinkOn: false }
  ]

  return (
    <div className={`instructions flex flex-col items-center text-center ${scrolled ? 'instructions--scrolled' : ''}`}>
      {/* ---------- TÍTULO Y ESTRELLAS ---------- */}
      <div className="flex items-end justify-center gap-4">
        <div className="instructions__title-container">
          {stars.map(({ key, blinkOn }) => (
            <StarIcon
              key={key}
              className={`star star--${key} ${
                blinkOn
                  ? (blink ? 'star--blink-on' : 'star--blink-off')
                  : (blink ? 'star--blink-off' : 'star--blink-on')
              }`}
            />
          ))}
          <h3 className="instructions__title">
            ¿Cómo trabajamos?
          </h3>
        </div>
      </div>
      <div className={`div-prueba ${isVisible ? 'visible' : ''}`}></div>
      <div className={`div-prueba prueba-2 ${isVisible2 ? 'visible-2' : ''}`}></div>
      <div className={`div-prueba prueba-3 ${isVisible3 ? 'visible-3' : ''}`}>
        {/* Logo principal y parpadeo, ahora hijo del tercer box */}
        {!showBlink && isLogoVisible && (
          <img src={NoniniLogo} alt="Nonini Logo" className={`nonini ${isVisible4 ? 'visible-nonini' : ''} ${showStars ? 'nonini-hide' : ''} ${firstAppear ? 'first-appear' : ''}`} />
        )}
        {showBlink && isLogoVisible && (
          <img src={NoniniLogoBlink} alt="Nonini Logo" className={`nonini ${isVisible4 ? 'visible-nonini' : ''} ${showStars ? 'nonini-hide' : ''}`} />
        )}
        {/* Nonini Stars animado — siempre en el DOM para que la transición funcione */}
        <img
          src={NoniniStars}
          alt="Nonini Stars"
          className={`nonini-stars ${
            !showStars ? 'stars-hidden'
            : starsReturning ? 'stars-returning'
            : 'stars-visible'
          }`}
        />
      </div>
    </div>
  )
}