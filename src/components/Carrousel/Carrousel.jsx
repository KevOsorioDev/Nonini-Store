import { useNavigate } from 'react-router-dom'
import buzoFrente from '../../assets/images/buzo_frente.png'
import { useSitio } from '../../context/SitioContext'
import { resolverUrl } from '../../services/api'
import './Carrousel.css'

export const Carrousel = () => {
  const navigate = useNavigate()
  const { sitio } = useSitio()
  const titulo = (sitio.heroTitulo || '').split('\n')
  const imagen = resolverUrl(sitio.heroImagenUrl) || buzoFrente

  return (
    <section className="hero">
      <div className="hero__copy">
        {sitio.heroEyebrow && <p className="hero__eyebrow">{sitio.heroEyebrow}</p>}
        <h1 className="hero__title">
          {titulo.map((linea, index) => (
            <span key={index}>
              {linea}
              {index < titulo.length - 1 && <br />}
            </span>
          ))}
        </h1>
        {sitio.heroSubtitulo && (
          <p className="hero__subtitle">{sitio.heroSubtitulo}</p>
        )}
        <button type="button" className="hero__cta" onClick={() => navigate('/productos')}>
          {sitio.heroCta || 'Elegí un diseño'}
        </button>
      </div>
      <div className="hero__visual">
        <img src={imagen} alt="Nonini" />
      </div>
    </section>
  )
}
