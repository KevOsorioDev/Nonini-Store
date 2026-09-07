import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { productosService, sitioService, resolverUrl } from '../../services/api'
import { SITIO_DEFAULTS } from '../../data/sitioDefaults'
import { useSitio } from '../../context/SitioContext'

const CampoImagen = ({ label, value, onChange }) => {
  const [subiendo, setSubiendo] = useState(false)

  const handle = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB')
      return
    }
    setSubiendo(true)
    try {
      const url = await productosService.subirImagen(file)
      onChange(url)
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo subir la imagen')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
          {value ? (
            <img src={resolverUrl(value)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400 px-2 text-center">Sin imagen</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex px-3 py-2 bg-[var(--persian-plum-100)] text-[var(--persian-plum-800)] rounded-lg cursor-pointer hover:bg-[var(--persian-plum-200)] text-sm font-medium">
            {subiendo ? 'Subiendo…' : 'Subir imagen'}
            <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={subiendo} />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-red-600 hover:text-red-800 text-left"
            >
              Quitar
            </button>
          )}
          <p className="text-xs text-gray-500">Foto PNG o JPG, hasta 5 MB. Si no subís ninguna, se deja la que ya está.</p>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent'

const GestionSitio = () => {
  const { recargar } = useSitio()
  const [form, setForm] = useState(SITIO_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    sitioService.obtener()
      .then((data) => setForm({ ...SITIO_DEFAULTS, ...data }))
      .catch(() => toast.error('No se pudo cargar la configuración del sitio'))
      .finally(() => setLoading(false))
  }, [])

  const setCampo = (clave, valor) => {
    setForm((prev) => ({ ...prev, [clave]: valor }))
  }

  const setListaItem = (clave, index, campo, valor) => {
    setForm((prev) => {
      const lista = [...(prev[clave] || [])]
      lista[index] = { ...lista[index], [campo]: valor }
      return { ...prev, [clave]: lista }
    })
  }

  const agregarItem = (clave, vacio) => {
    setForm((prev) => ({ ...prev, [clave]: [...(prev[clave] || []), vacio] }))
  }

  const quitarItem = (clave, index) => {
    setForm((prev) => ({
      ...prev,
      [clave]: (prev[clave] || []).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setGuardando(true)
      const guardado = await sitioService.guardar(form)
      setForm({ ...SITIO_DEFAULTS, ...guardado })
      await recargar()
      toast.success('Sitio actualizado. Los cambios ya se ven en la tienda.')
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)] mx-auto" />
        <p className="mt-4 text-gray-600">Cargando configuración…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[var(--persian-plum-900)]">Contenido del sitio</h2>
        <p className="text-sm text-gray-600 mt-1">
          Acá cargás las imágenes, redes, textos y links que se ven en la tienda. El catálogo de productos está en la pestaña Productos.
        </p>
      </div>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Contacto y redes</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input className={`${inputClass} mt-1`} value={form.email} onChange={(e) => setCampo('email', e.target.value)} placeholder="hola@tutienda.com" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
            <input className={`${inputClass} mt-1`} value={form.telefono} onChange={(e) => setCampo('telefono', e.target.value)} placeholder="+54 11 …" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Instagram
            <input className={`${inputClass} mt-1`} value={form.instagram} onChange={(e) => setCampo('instagram', e.target.value)} placeholder="Link de tu Instagram" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Facebook
            <input className={`${inputClass} mt-1`} value={form.facebook} onChange={(e) => setCampo('facebook', e.target.value)} placeholder="Link de tu Facebook" />
          </label>
          <label className="block text-sm font-medium text-gray-700 md:col-span-2">
            WhatsApp
            <input className={`${inputClass} mt-1`} value={form.whatsapp} onChange={(e) => setCampo('whatsapp', e.target.value)} placeholder="Ej: 11 1234-5678" />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Portada</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Texto chico
            <input className={`${inputClass} mt-1`} value={form.heroEyebrow} onChange={(e) => setCampo('heroEyebrow', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Botón
            <input className={`${inputClass} mt-1`} value={form.heroCta} onChange={(e) => setCampo('heroCta', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-700 md:col-span-2">
            Título
            <textarea className={`${inputClass} mt-1`} rows={2} value={form.heroTitulo} onChange={(e) => setCampo('heroTitulo', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-700 md:col-span-2">
            Subtítulo
            <textarea className={`${inputClass} mt-1`} rows={3} value={form.heroSubtitulo} onChange={(e) => setCampo('heroSubtitulo', e.target.value)} />
          </label>
        </div>
        <CampoImagen label="Imagen de portada" value={form.heroImagenUrl} onChange={(url) => setCampo('heroImagenUrl', url)} />
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Cómo trabajamos</h3>
        {(form.pasos || []).map((paso, index) => (
          <div key={index} className="grid md:grid-cols-6 gap-3 items-start">
            <input className={inputClass} value={paso.n} onChange={(e) => setListaItem('pasos', index, 'n', e.target.value)} placeholder="01" />
            <input className={`${inputClass} md:col-span-2`} value={paso.titulo} onChange={(e) => setListaItem('pasos', index, 'titulo', e.target.value)} placeholder="Título" />
            <input className={`${inputClass} md:col-span-3`} value={paso.texto} onChange={(e) => setListaItem('pasos', index, 'texto', e.target.value)} placeholder="Texto" />
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Por qué Nonini</h3>
        {(form.whyUs || []).map((card, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <input className={inputClass} value={card.titulo} onChange={(e) => setListaItem('whyUs', index, 'titulo', e.target.value)} placeholder="Título" />
            <textarea className={inputClass} rows={2} value={card.texto} onChange={(e) => setListaItem('whyUs', index, 'texto', e.target.value)} placeholder="Texto" />
            <CampoImagen label={`Foto ${index + 1}`} value={card.imagenUrl} onChange={(url) => setListaItem('whyUs', index, 'imagenUrl', url)} />
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Preguntas frecuentes</h3>
          <button
            type="button"
            onClick={() => agregarItem('faqs', { pregunta: '', respuesta: '' })}
            className="text-sm px-3 py-1.5 rounded-lg bg-[var(--persian-plum-100)] text-[var(--persian-plum-800)]"
          >
            + Agregar
          </button>
        </div>
        {(form.faqs || []).map((faq, index) => (
          <div key={index} className="space-y-2 border border-gray-200 rounded-xl p-4">
            <input className={inputClass} value={faq.pregunta} onChange={(e) => setListaItem('faqs', index, 'pregunta', e.target.value)} placeholder="Pregunta" />
            <textarea className={inputClass} rows={2} value={faq.respuesta} onChange={(e) => setListaItem('faqs', index, 'respuesta', e.target.value)} placeholder="Respuesta" />
            <button type="button" onClick={() => quitarItem('faqs', index)} className="text-sm text-red-600">Quitar</button>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Enlaces del pie de página</h3>
          <button
            type="button"
            onClick={() => agregarItem('helpLinks', { label: '', href: '/' })}
            className="text-sm px-3 py-1.5 rounded-lg bg-[var(--persian-plum-100)] text-[var(--persian-plum-800)]"
          >
            + Agregar
          </button>
        </div>
        {(form.helpLinks || []).map((link, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-3 items-center">
            <input className={`${inputClass} md:col-span-2`} value={link.label} onChange={(e) => setListaItem('helpLinks', index, 'label', e.target.value)} placeholder="Texto del enlace" />
            <input className={`${inputClass} md:col-span-2`} value={link.href} onChange={(e) => setListaItem('helpLinks', index, 'href', e.target.value)} placeholder="Link de la página" />
            <button type="button" onClick={() => quitarItem('helpLinks', index)} className="text-sm text-red-600">Quitar</button>
          </div>
        ))}
        <label className="block text-sm font-medium text-gray-700">
          Título del newsletter
          <input className={`${inputClass} mt-1`} value={form.newsletterTitulo} onChange={(e) => setCampo('newsletterTitulo', e.target.value)} />
        </label>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[var(--persian-plum-900)]">Textos de la tienda</h3>
        <label className="block text-sm font-medium text-gray-700">
          Envíos
          <textarea className={`${inputClass} mt-1`} rows={3} value={form.enviosTexto} onChange={(e) => setCampo('enviosTexto', e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Materiales y cuidado
          <textarea className={`${inputClass} mt-1`} rows={3} value={form.materialesTexto} onChange={(e) => setCampo('materialesTexto', e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Precio de prenda personalizada
          <input
            type="number"
            min="0"
            step="100"
            className={`${inputClass} mt-1 max-w-xs`}
            value={form.precioPersonalizado}
            onChange={(e) => setCampo('precioPersonalizado', e.target.value)}
          />
        </label>
      </section>

      <div className="sticky bottom-4 bg-white rounded-lg shadow-lg p-4 flex justify-end">
        <button
          type="submit"
          disabled={guardando}
          className="px-6 py-2.5 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] disabled:opacity-50"
        >
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

export default GestionSitio
