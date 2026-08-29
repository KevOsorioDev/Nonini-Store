import { Link, useLocation } from 'react-router-dom'

const paginas = {
  '/terminos': {
    titulo: 'Términos y condiciones',
    bloques: [
      {
        titulo: 'Uso del sitio',
        texto: 'Al usar Nonini Store aceptás estos términos. Los diseños, precios y tiempos de producción pueden variar según cada pedido.'
      },
      {
        titulo: 'Pedidos personalizados',
        texto: 'Las prendas se elaboran a pedido. El bordado se realiza sobre el diseño que elijas o el archivo que nos envíes. Es tu responsabilidad contar con derecho a usar ese diseño.'
      },
      {
        titulo: 'Envíos',
        texto: 'El plazo habitual es de 3 a 5 días hábiles de producción más el tiempo de envío. Los plazos exactos se confirman al cerrar el pedido.'
      }
    ]
  },
  '/privacidad': {
    titulo: 'Política de privacidad',
    bloques: [
      {
        titulo: 'Qué datos guardamos',
        texto: 'Usamos tu nombre, email y datos de envío solo para gestionar tu cuenta y tus pedidos. No vendemos esa información.'
      },
      {
        titulo: 'Cookies y sesión',
        texto: 'Guardamos en tu navegador lo necesario para la sesión y el carrito. Podés borrar esos datos desde la configuración del navegador.'
      },
      {
        titulo: 'Contacto',
        texto: 'Si querés consultar o pedir la baja de tus datos, escribinos a hola@nonini.com.'
      }
    ]
  }
}

export const LegalPage = () => {
  const { pathname } = useLocation()
  const pagina = paginas[pathname] || paginas['/terminos']

  return (
    <div className="min-h-screen bg-[var(--persian-plum-50)] pt-32 md:pt-40 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--persian-plum-900)] mb-8">
          {pagina.titulo}
        </h1>
        <div className="flex flex-col gap-8">
          {pagina.bloques.map((bloque) => (
            <section key={bloque.titulo}>
              <h2 className="text-xl font-semibold text-[var(--persian-plum-800)] mb-2">
                {bloque.titulo}
              </h2>
              <p className="text-[var(--persian-plum-700)] leading-relaxed">
                {bloque.texto}
              </p>
            </section>
          ))}
        </div>
        <Link
          to="/"
          className="inline-block mt-10 text-[var(--persian-plum-700)] hover:text-[var(--persian-plum-900)] font-medium"
        >
          ← Volver al inicio
        </Link>
      </article>
    </div>
  )
}
