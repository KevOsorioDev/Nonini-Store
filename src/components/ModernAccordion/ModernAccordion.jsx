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

const accordionData = [
  {
    id: 'faq-diseno',
    title: '¿Puedo mandar mi propio diseño?',
    content: <p>Sí. Subís tu archivo, elegís prenda, talle y color, y nosotros lo bordamos.</p>
  },
  {
    id: 'faq-envios',
    title: '¿Cuánto tarda el envío?',
    content: <p>Como cada prenda se hace a pedido, el tiempo habitual es de 3 a 5 días hábiles más el envío.</p>
  },
  {
    id: 'faq-talles',
    title: '¿Cómo elijo el talle?',
    content: <p>Usamos talles S a XL. Si estás entre dos, te recomendamos ir al más holgado: las prendas son 100% algodón.</p>
  }
]

export const ModernAccordion = () => {
  return (
    <div className="accordion-container">
      {accordionData.map((item, index) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          isLast={index === accordionData.length - 1}
        />
      ))}
    </div>
  )
}