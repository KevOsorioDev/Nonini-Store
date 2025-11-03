import './PorQueElegirnos.css'

const reasons = [
  {
    id: 1,
    text: '¡Diseñamos lo que más te guste! Al poder basarnos en los diseños que nos mandan los clientes, nos aseguramos de que tu prenda quede como vos la imagines.',
    variant: 'primary'
  },
  {
    id: 2,
    text: 'Nuestras prendas utilizan materiales basados en 100% algodón, por lo que son de la mejor calidad.',
    variant: 'secondary'
  },
  {
    id: 3,
    text: '',
    variant: 'tertiary'
  }
]

export const PorQueElegirnos = () => {
  return (
    <section className="why-us flex flex-col items-center justify-center">
      
      <h3 className="why-us__title">
        ¿Por qué elegirnos?
      </h3>

      <div className="why-us__grid flex gap-14 justify-center items-center">
        {reasons.map(reason => (
          <div 
            key={reason.id}
            className={`card-base why-us__card why-us__card--${reason.variant}`}
          >
            {reason.text}
          </div>
        ))}
      </div>
    </section>
  )
}