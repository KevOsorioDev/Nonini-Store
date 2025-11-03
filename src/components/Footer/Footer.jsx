import { SuscribeInput } from '../SuscribeInput/SuscribeInput'
import { ModernAccordion } from '../ModernAccordion/ModernAccordion.jsx'
import './Footer.css'

const helpLinks = [
  { id: 1, label: 'Link 1', href: '#' },
  { id: 2, label: 'Link 2', href: '#' },
  { id: 3, label: 'Link 3', href: '#' }
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
            href='mailto:contacto@nonini@gmail.com'
            className='footer-email'
          >
            contacto@nonini@gmail.com
          </a>
        </span>
      </div>

      <div className='footer-column'>
        <span className='footer-title'>
          Ayudas y links importantes
        </span>
        {helpLinks.map(link => (
          <a 
            key={link.id} 
            href={link.href} 
            className="footer-link"
          >
            {link.label}
          </a>
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