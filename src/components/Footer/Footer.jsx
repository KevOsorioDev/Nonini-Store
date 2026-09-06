import { Link } from 'react-router-dom'
import { SuscribeInput } from '../SuscribeInput/SuscribeInput'
import { ModernAccordion } from '../ModernAccordion/ModernAccordion.jsx'
import { useSitio } from '../../context/SitioContext'
import { linkWhatsapp } from '../../data/sitioDefaults'
import './Footer.css'

const esExterno = (href) => /^https?:\/\//i.test(href)

export const Footer = () => {
  const { sitio } = useSitio()
  const helpLinks = (sitio.helpLinks || []).filter((link) => link.label && link.href)
  const whatsapp = linkWhatsapp(sitio.whatsapp)

  return (
    <footer className='relative mt-16 footer-container'>
      <div className='absolute top-0 w-[100%] h-auto flex justify-center items-center'>
        <div className="w-[85%] mx-auto border-t-2 border-[var(--persian-plum-300)] mb-8"></div>
      </div>

      <div className='footer-column footer-column--centered'>
        <span className='footer-title'>
          {sitio.newsletterTitulo}
        </span>
        <SuscribeInput />
      </div>

      <div className='footer-column footer-column--centered'>
        <span className='footer-title'>Contacto</span>
        {sitio.email && (
          <span className='footer-contact'>
            <i className='fa-regular fa-envelope'></i>
            <a href={`mailto:${sitio.email}`} className='footer-email'>
              {sitio.email}
            </a>
          </span>
        )}
        {sitio.telefono && (
          <span className='footer-contact'>
            <i className='fa-solid fa-phone'></i>
            <a href={`tel:${sitio.telefono}`} className='footer-email'>
              {sitio.telefono}
            </a>
          </span>
        )}
        {sitio.instagram && (
          <span className='footer-contact'>
            <a href={sitio.instagram} target='_blank' rel='noreferrer' className='footer-link'>
              <i className='fa-brands fa-instagram'></i> Instagram
            </a>
          </span>
        )}
        {sitio.facebook && (
          <span className='footer-contact'>
            <a href={sitio.facebook} target='_blank' rel='noreferrer' className='footer-link'>
              <i className='fa-brands fa-facebook'></i> Facebook
            </a>
          </span>
        )}
        {whatsapp && (
          <span className='footer-contact'>
            <a href={whatsapp} target='_blank' rel='noreferrer' className='footer-link'>
              <i className='fa-brands fa-whatsapp'></i> WhatsApp
            </a>
          </span>
        )}
      </div>

      <div className='footer-column'>
        <span className='footer-title'>
          Ayudas y links importantes
        </span>
        {helpLinks.map((link) => (
          esExterno(link.href) ? (
            <a key={`${link.label}-${link.href}`} href={link.href} target='_blank' rel='noreferrer' className="footer-link">
              {link.label}
            </a>
          ) : (
            <Link key={`${link.label}-${link.href}`} to={link.href} className="footer-link">
              {link.label}
            </Link>
          )
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