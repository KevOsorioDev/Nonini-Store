import './PorQueElegirnos.css'
import fotoBordado from '../../assets/images/proceso-bordado.jpg'
import fotoAlgodon from '../../assets/images/proceso-algodon.jpg'
import fotoPedido from '../../assets/images/proceso-pedido.jpg'
import { useSitio } from '../../context/SitioContext'
import { resolverUrl } from '../../services/api'

const fallbacks = [fotoBordado, fotoAlgodon, fotoPedido]

export const PorQueElegirnos = () => {
  const { sitio } = useSitio()
  const reasons = (sitio.whyUs || []).map((reason, index) => ({
    ...reason,
    foto: resolverUrl(reason.imagenUrl) || fallbacks[index] || fallbacks[0]
  }))

  return (
    <section id="why-us" className="why-us home-stack__panel home-stack__panel--3">
      <div className="home-stack__sheet">
      <span className="home-stack__index">03</span>
      <div className="home-stack__inner">
      <h2 className="home-section-title">Por qué Nonini</h2>
      <div className="why-us__grid">
        {reasons.map((reason, index) => (
          <article key={`${reason.titulo}-${index}`} className="why-us__card">
            <div className="why-us__media">
              <img src={reason.foto} alt="" />
            </div>
            <h3>{reason.titulo}</h3>
            <p>{reason.texto}</p>
          </article>
        ))}
      </div>
      </div>
      </div>
    </section>
  )
}
