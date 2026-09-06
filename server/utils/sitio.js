export const SITIO_CLAVE = 'sitio'

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

const texto = (valor, fallback = '') => {
  if (valor == null) return fallback
  return String(valor).trim()
}

const numero = (valor, fallback) => {
  const n = Number(valor)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

const mergeLista = (lista, defaults, mapear) => {
  if (!Array.isArray(lista) || lista.length === 0) return defaults
  return lista.map((item, index) => mapear(item || {}, defaults[index] || {}))
}

export const mergeSitio = (raw) => {
  let data = raw
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch {
      data = {}
    }
  }
  if (!data || typeof data !== 'object') data = {}

  return {
    email: texto(data.email, SITIO_DEFAULTS.email),
    instagram: texto(data.instagram, SITIO_DEFAULTS.instagram),
    facebook: texto(data.facebook, SITIO_DEFAULTS.facebook),
    whatsapp: texto(data.whatsapp, SITIO_DEFAULTS.whatsapp),
    telefono: texto(data.telefono, SITIO_DEFAULTS.telefono),
    heroEyebrow: texto(data.heroEyebrow, SITIO_DEFAULTS.heroEyebrow),
    heroTitulo: texto(data.heroTitulo, SITIO_DEFAULTS.heroTitulo) || SITIO_DEFAULTS.heroTitulo,
    heroSubtitulo: texto(data.heroSubtitulo, SITIO_DEFAULTS.heroSubtitulo),
    heroCta: texto(data.heroCta, SITIO_DEFAULTS.heroCta) || SITIO_DEFAULTS.heroCta,
    heroImagenUrl: texto(data.heroImagenUrl),
    pasos: mergeLista(data.pasos, SITIO_DEFAULTS.pasos, (item, fallback) => ({
      n: texto(item.n, fallback.n),
      titulo: texto(item.titulo, fallback.titulo),
      texto: texto(item.texto, fallback.texto)
    })),
    whyUs: mergeLista(data.whyUs, SITIO_DEFAULTS.whyUs, (item, fallback) => ({
      titulo: texto(item.titulo, fallback.titulo),
      texto: texto(item.texto, fallback.texto),
      imagenUrl: texto(item.imagenUrl)
    })),
    faqs: mergeLista(data.faqs, SITIO_DEFAULTS.faqs, (item, fallback) => ({
      pregunta: texto(item.pregunta, fallback.pregunta),
      respuesta: texto(item.respuesta, fallback.respuesta)
    })),
    helpLinks: mergeLista(data.helpLinks, SITIO_DEFAULTS.helpLinks, (item, fallback) => ({
      label: texto(item.label, fallback.label),
      href: texto(item.href, fallback.href)
    })),
    newsletterTitulo: texto(data.newsletterTitulo, SITIO_DEFAULTS.newsletterTitulo) || SITIO_DEFAULTS.newsletterTitulo,
    enviosTexto: texto(data.enviosTexto, SITIO_DEFAULTS.enviosTexto),
    materialesTexto: texto(data.materialesTexto, SITIO_DEFAULTS.materialesTexto),
    precioPersonalizado: numero(data.precioPersonalizado, SITIO_DEFAULTS.precioPersonalizado)
  }
}
