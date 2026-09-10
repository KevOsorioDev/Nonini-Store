import { useLayoutEffect } from 'react'
import { lenis } from '../lenis.js'

const TOPS_DESKTOP = [0.26, 0.32, 0.38]
const MOBILE = '(max-width: 900px)'

const acotar = (n) => Math.max(0, Math.min(1, n))

export const useStackCover = (selector = '.home-stack__panel') => {
  useLayoutEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobileMq = window.matchMedia(MOBILE)
    let raf = 0

    const panelesDe = () => document.querySelectorAll(selector)
    const esMobile = () => mobileMq.matches

    const actualizarMobile = () => {
      panelesDe().forEach((panel) => {
        panel.style.setProperty('--fade', '1')
        panel.style.setProperty('--near', '1')
        panel.style.setProperty('--leave', '0')
        panel.style.removeProperty('--cover')
        panel.style.removeProperty('--rise')
        panel.classList.add('home-stack__panel--on')
        panel.classList.remove('home-stack__panel--near')
      })
    }

    const progresoDe = (rect, vh, rest) => {
      if (reducir) return 1
      const start = vh * 1.06
      const span = Math.max(vh * 0.45, start - rest)
      return acotar((start - rect.top) / span)
    }

    const actualizarDesktop = () => {
      const vh = window.innerHeight
      const paneles = panelesDe()
      const fin = paneles[0]?.closest('.home-stack')?.querySelector('.home-stack__end')
      const finTop = fin ? fin.getBoundingClientRect().top : vh * 3
      const receso = reducir
        ? 0
        : acotar((vh * 0.98 - finTop) / Math.max(vh * 0.7, 1))

      paneles.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect()
        const siguiente = paneles[i + 1]
        if (!siguiente) {
          panel.style.setProperty('--cover', '0')
        } else {
          const proximo = siguiente.getBoundingClientRect()
          const recorre = Math.max(80, rect.height * 0.35)
          const cubierto = Math.max(0, Math.min(1, (rect.top + 48 - proximo.top) / recorre))
          panel.style.setProperty('--cover', String(cubierto))
          siguiente.style.setProperty('--rise', String(cubierto))
        }

        const rest = TOPS_DESKTOP[i] * vh
        const leave = receso
        const near = leave > 0.03 ? 1 : progresoDe(rect, vh, rest)
        const fade = acotar(near * 1.35)
        panel.style.setProperty('--fade', fade.toFixed(4))
        panel.style.setProperty('--near', near.toFixed(4))
        panel.style.setProperty('--leave', leave.toFixed(4))
        panel.classList.toggle('home-stack__panel--on', fade > 0.12)
        panel.classList.toggle('home-stack__panel--near', near > 0.92)
      })
      if (paneles[0]) paneles[0].style.setProperty('--rise', '1')
    }

    const onFrame = () => {
      raf = 0
      if (esMobile()) actualizarMobile()
      else actualizarDesktop()
    }

    const pedir = () => {
      if (!raf) raf = window.requestAnimationFrame(onFrame)
    }

    const onResize = () => {
      if (esMobile()) actualizarMobile()
      else actualizarDesktop()
    }

    onResize()

    const off = lenis.on('scroll', pedir)
    window.addEventListener('scroll', pedir, { passive: true })
    window.addEventListener('resize', onResize)
    mobileMq.addEventListener?.('change', onResize)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      if (typeof off === 'function') off()
      else if (lenis.off) lenis.off('scroll', pedir)
      window.removeEventListener('scroll', pedir)
      window.removeEventListener('resize', onResize)
      mobileMq.removeEventListener?.('change', onResize)
    }
  }, [selector])
}
