import NoniniLogo from '../../assets/images/nonini_logo.png'
import { useSitio } from '../../context/SitioContext'
import './Instrucciones.css'

export const Instrucciones = () => {
  const { sitio } = useSitio()
  const pasos = sitio.pasos || []

  return (
    <section className="instructions" aria-labelledby="como-trabajamos">
      <div className="instructions__brand">
        <img src={NoniniLogo} alt="" className="instructions__logo" />
        <div>
          <p className="instructions__eyebrow">Nonini</p>
          <h2 id="como-trabajamos" className="instructions__title">Cómo trabajamos</h2>
        </div>
      </div>
      <ol className="instructions__steps">
        {pasos.map((paso, index) => (
          <li key={`${paso.n}-${index}`} className="instructions__step">
            <span className="instructions__n">{paso.n}</span>
            <h3>{paso.titulo}</h3>
            <p>{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
