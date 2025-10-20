export const PorQueElegirnos = () => {
  return (
    <section className="
      flex flex-col items-center justify-center w-full py-20
    ">
      <h3 className="
        text-3xl font-bold mb-14 text-[var(--persian-plum-900)]
      ">
        ¿Por qué elegirnos?
      </h3>
      <div className="flex gap-14 justify-center items-center">
        {/* Punto 1 */}
        <div className="
          card-base bg-[var(--persian-plum-300)]
          text-[var(--persian-plum-900)]
        ">
          ¡Diseñamos lo que más te guste! Al poder basarnos en los diseños que nos mandan los clientes, nos aseguramos de que tu prenda quede como vos la imagines.
        </div>
        {/* Punto 2 */}
        <div className="
          card-base bg-[var(--persian-plum-400)]
          text-[var(--persian-plum-50)]
        ">
          Nuestras prendas utilizan materiales basados en 100% algodón, por lo que son de la mejor calidad.
        </div>
        {/* Punto 3 */}
        <div className="
          card-base bg-[var(--persian-plum-200)]
          text-[var(--persian-plum-900)]
        ">
          {/* Espacio para el tercer punto */}
        </div>
      </div>
    </section>
  )
}