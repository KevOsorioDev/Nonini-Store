import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import buzoCrema from '../../assets/images/buzo-crema-home.png'
import buzoRosa from '../../assets/images/buzo-rosa-home.png'
import buzoVerde from '../../assets/images/buzo-verde-home.png'
import { useSitio } from '../../context/SitioContext'
import './Carrousel.css'

const FRASES = [
  ['Tu diseño favorito,', 'en tu ropa favorita.'],
  ['¿Querés estar a la moda,', 'y llevar algo que te represente?'],
  ['En esta página no juzgamos.', 'Podés ser 100% vos.'],
  ['Si lo imaginás,', 'lo bordamos.']
]

export const Carrousel = () => {
  const navigate = useNavigate()
  const { sitio } = useSitio()
  const [indice, setIndice] = useState(0)
  const [sale, setSale] = useState(false)
  const titulo = FRASES[indice]

  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let fade = 0
    let vivo = true
    const id = window.setInterval(() => {
      if (!vivo) return
      if (reducir) {
        setIndice((actual) => (actual + 1) % FRASES.length)
        return
      }
      setSale(true)
      fade = window.setTimeout(() => {
        if (!vivo) return
        setIndice((actual) => (actual + 1) % FRASES.length)
        setSale(false)
      }, 420)
    }, 7000)
    return () => {
      vivo = false
      window.clearInterval(id)
      window.clearTimeout(fade)
    }
  }, [])

  return (
    <section className="hero">
      <div className="hero__stage">
        <div className="hero__stack">
          <img src={buzoVerde} alt="" className="hero__piece hero__piece--verde" />
          <img src={buzoRosa} alt="" className="hero__piece hero__piece--rosa" />
          <img src={buzoCrema} alt="" className="hero__piece hero__piece--crema" />
        </div>
      </div>

      <div className={`hero__copy${sale ? ' hero__copy--out' : ''}`}>
        <h1 className="hero__title">
          {titulo.map((linea, index) => (
            <span key={`${indice}-${index}`}>
              {linea}
              {index < titulo.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="hero__subtitle">
          Elegí uno del catálogo o subí el tuyo. Lo bordamos a pedido, en algodón y sin vueltas!
        </p>
        <button type="button" className="hero__cta" onClick={() => navigate('/productos')}>
          <span>{sitio.heroCta || 'Elegí un diseño'}</span>
        </button>
      </div>
    </section>
  )
}
