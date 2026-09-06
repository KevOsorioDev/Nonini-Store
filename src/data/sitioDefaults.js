export const SITIO_DEFAULTS = {
  email: '',
  instagram: '',
  facebook: '',
  whatsapp: '',
  telefono: '',
  heroEyebrow: 'Bordados a pedido',
  heroTitulo: 'Tu diseño,\nen una prenda.',
  heroSubtitulo: 'Remeras y buzos bordados con el diseño que elijas. Hechos a pedido, en algodón.',
  heroCta: 'Elegí un diseño',
  heroImagenUrl: '',
  pasos: [
    { n: '01', titulo: 'Elegís', texto: 'Un diseño del catálogo o el tuyo.' },
    { n: '02', titulo: 'Bordamos', texto: 'A pedido, sobre algodón.' },
    { n: '03', titulo: 'Te llega', texto: 'La prenda lista para usar.' }
  ],
  whyUs: [
    {
      titulo: 'Tu diseño',
      texto: 'Bordamos lo que imagines, a partir de lo que nos mandás o de un diseño del catálogo.',
      imagenUrl: ''
    },
    {
      titulo: 'Algodón',
      texto: 'Prendas 100% algodón. Tela pesada, cómoda, hecha para usar todos los días.',
      imagenUrl: ''
    },
    {
      titulo: 'A pedido',
      texto: 'Cada pieza se trabaja cuando la pedís. Cuidamos el bordado y el resultado.',
      imagenUrl: ''
    }
  ],
  faqs: [
    {
      pregunta: '¿Puedo mandar mi propio diseño?',
      respuesta: 'Sí. Subís tu archivo, elegís prenda, talle y color, y nosotros lo bordamos.'
    },
    {
      pregunta: '¿Cuánto tarda el envío?',
      respuesta: 'Como cada prenda se hace a pedido, el tiempo habitual es de 3 a 5 días hábiles más el envío.'
    },
    {
      pregunta: '¿Cómo elijo el talle?',
      respuesta: 'Usamos talles S a XL. Si estás entre dos, te recomendamos ir al más holgado: las prendas son 100% algodón.'
    }
  ],
  helpLinks: [
    { label: 'Cómo comprar', href: '/productos' },
    { label: 'Envíos', href: '/#why-us' },
    { label: 'Cuidado de prendas', href: '/#why-us' },
    { label: 'Términos y condiciones', href: '/terminos' },
    { label: 'Privacidad', href: '/privacidad' }
  ],
  newsletterTitulo: '¡Suscribite para recibir ofertas!',
  enviosTexto: 'El plazo habitual es de 3 a 5 días hábiles de producción más el tiempo de envío. Los plazos exactos se confirman al cerrar el pedido.',
  materialesTexto: '100% algodón de alta calidad. Lavar a máquina con agua fría.',
  precioPersonalizado: 7000
}

export const linkWhatsapp = (valor) => {
  const dato = String(valor || '').trim()
  if (!dato) return ''
  if (/^https?:\/\//i.test(dato)) return dato
  const digitos = dato.replace(/\D/g, '')
  return digitos ? `https://wa.me/${digitos}` : ''
}
