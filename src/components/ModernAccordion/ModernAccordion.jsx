import { useSitio } from '../../context/SitioContext'
import './ModernAccordion.css'

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" height={16} width={16}>
    <path 
      d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" 
      fill="currentColor" 
    />
  </svg>
)

const AccordionItem = ({ id, title, content, isLast = false }) => (
  <div className={`accordion-item ${isLast ? '' : 'mb-2'}`}>
    <input
      type="checkbox"
      id={id}
      className="accordion-input"
    />
    <label htmlFor={id} className="accordion-label">
      <span className="accordion-title">{title}</span>
      <span className="accordion-icon">
        <ChevronIcon />
      </span>
    </label>
    <div className="accordion-content">
      {content}
    </div>
  </div>
)

export const ModernAccordion = () => {
  const { sitio } = useSitio()
  const faqs = sitio.faqs || []

  return (
    <div className="accordion-container">
      {faqs.map((item, index) => (
        <AccordionItem
          key={`${item.pregunta}-${index}`}
          id={`faq-${index}`}
          title={item.pregunta}
          content={<p>{item.respuesta}</p>}
          isLast={index === faqs.length - 1}
        />
      ))}
    </div>
  )
}