import { useEffect } from 'react'
import { lenis } from '../lenis.js'

const TOPS = [0.26, 0.32, 0.38]

export const useStackCover = (selector = '.home-stack__panel') => {
  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let idle = 0
    let snapping = false

    const panelesDe = () => document.querySelectorAll(selector)

    const actualizar = () => {
      const paneles = panelesDe()
      paneles.forEach((panel, i) => {
        const siguiente = paneles[i + 1]
        if (!siguiente) {
          panel.style.setProperty('--cover', '0')
          return
        }
        const actual = panel.getBoundingClientRect()
        const proximo = siguiente.getBoundingClientRect()
        const recorre = Math.max(80, actual.height * 0.35)
        const cubierto = Math.max(0, Math.min(1, (actual.top + 48 - proximo.top) / recorre))
        panel.style.setProperty('--cover', String(cubierto))
        siguiente.style.setProperty('--rise', String(cubierto))
      })
      if (paneles[0]) paneles[0].style.setProperty('--rise', '1')
    }

    const snapCercano = () => {
      if (reducir || snapping) return
      const vh = window.innerHeight
      const paneles = panelesDe()
      let mejor = null
      paneles.forEach((panel, i) => {
        const d = panel.getBoundingClientRect().top - TOPS[i] * vh
        if (Math.abs(d) > 14 && Math.abs(d) < 120) {
          if (!mejor || Math.abs(d) < Math.abs(mejor.d)) mejor = { d }
        }
      })
      if (!mejor) return
      snapping = true
      lenis.scrollTo(lenis.scroll + mejor.d, {
        duration: 0.62,
        easing: (t) => 1 - (1 - t) ** 3
      })
      window.setTimeout(() => {
        snapping = false
      }, 680)
    }

    const onScroll = () => {
      actualizar()
      if (reducir) return
      window.clearTimeout(idle)
      idle = window.setTimeout(snapCercano, 88)
    }

    actualizar()
    const off = lenis.on('scroll', onScroll)
    window.addEventListener('resize', actualizar)
    return () => {
      window.clearTimeout(idle)
      if (typeof off === 'function') off()
      else if (lenis.off) lenis.off('scroll', onScroll)
      window.removeEventListener('resize', actualizar)
    }
  }, [selector])
}
