import { Link } from 'react-router-dom'
import { SuscribeInput } from '../SuscribeInput/SuscribeInput'
import { ModernAccordion } from '../ModernAccordion/ModernAccordion.jsx'
import './Footer.css'

const helpLinks = [
  { id: 1, label: 'Cómo comprar', href: '/productos' },
  { id: 2, label: 'Envíos', href: '/#why-us' },
  { id: 3, label: 'Cuidado de prendas', href: '/#why-us' },
  { id: 4, label: 'Términos y condiciones', href: '/terminos' },
  { id: 5, label: 'Privacidad', href: '/privacidad' }
]

export const Footer = () => {
  return (
    <footer className='relative mt-45 footer-container'>
      <div className='absolute top-0 w-[100%] h-auto flex justify-center items-center'>
        <div className="w-[85%] mx-auto border-t-2 border-[var(--persian-plum-300)] mb-8"></div>
      </div>

      <div className='footer-column footer-column--centered'>
        <span className='footer-title'>
          ¡Suscribite para recibir ofertas!
        </span>
        <SuscribeInput />
      </div>

      <div className='footer-column footer-column--centered'>
        <span className='footer-title'>Contacto</span>
        <span className='footer-contact'>
          <i className='fa-regular fa-envelope'></i>
          <a
            href='mailto:hola@nonini.com'
            className='footer-email'
          >
            hola@nonini.com
          </a>
        </span>
        <span className='footer-contact'>
          <a href='https://instagram.com' target='_blank' rel='noreferrer' className='footer-link'>
            <i className='fa-brands fa-instagram'></i> Instagram
          </a>
        </span>
        <span className='footer-contact'>
          <a href='https://facebook.com' target='_blank' rel='noreferrer' className='footer-link'>
            <i className='fa-brands fa-facebook'></i> Facebook
          </a>
        </span>
      </div>

      <div className='footer-column'>
        <span className='footer-title'>
          Ayudas y links importantes
        </span>
        {helpLinks.map(link => (
          <Link
            key={link.id}
            to={link.href}
            className="footer-link"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className='footer-column footer-column--centered'>
        <span className='footer-title'>
          Preguntas frecuentes
        </span>
        <ModernAccordion />
      </div>
    </footer>
  )
}