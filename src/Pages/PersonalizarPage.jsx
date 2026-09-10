import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ProductPreview } from '../components/ProductPreview/ProductPreview'
import { useCart } from '../context/useCart'
import { useSitio } from '../context/SitioContext'
import buzoFrente from '../assets/images/buzo_frente.png'
import remeraFrente from '../assets/images/remera_frente.png'
import {
  anchoEnPreviewPct,
  cmAPx,
  largoMaximo,
  largoMinimo,
  leerMedidasImagen,
  medidasDesdeLargo
} from '../utils/disenoMedidas'

const prendas = ['Remera', 'Buzo']
const talles = ['S', 'M', 'L', 'XL']
const posicionesLogo = ['Izquierda', 'Centro', 'Derecha']
const colores = [
  { name: 'Blanco', class: 'bg-white border border-[var(--persian-plum-300)]' },
  { name: 'Negro', class: 'bg-black' },
  { name: 'Ciruela', class: 'bg-[var(--persian-plum-700)]' }
]

const prendaImagen = (prenda) => (prenda === 'Remera' ? remeraFrente : buzoFrente)

const defaultsPos = {
  izquierda: { top: 15, left: 25 },
  centro: { top: 15, left: 50 },
  derecha: { top: 15, left: 75 },
  custom: { top: 15, left: 50 }
}

export const PersonalizarPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()
  const { sitio } = useSitio()
  const prendaInicial = searchParams.get('prenda') === 'Remera' ? 'Remera' : 'Buzo'
  const precio = Number(sitio.precioPersonalizado) || 7000
  const [prenda, setPrenda] = useState(prendaInicial)
  const [talle, setTalle] = useState('M')
  const [color, setColor] = useState(colores[0].class)
  const [cantidad, setCantidad] = useState(1)
  const [sideSelected, setSideSelected] = useState('centro')
  const [logoPosition, setLogoPosition] = useState(defaultsPos.centro)
  const [largoCm, setLargoCm] = useState(8)
  const [disenoUrl, setDisenoUrl] = useState(null)
  const [imagenPx, setImagenPx] = useState({ w: 1, h: 1 })

  useEffect(() => {
    const siguiente = searchParams.get('prenda')
    if (siguiente === 'Remera' || siguiente === 'Buzo') setPrenda(siguiente)
  }, [searchParams])

  const minLargo = largoMinimo(imagenPx.w, imagenPx.h)
  const maxLargo = largoMaximo(imagenPx.w, imagenPx.h)
  const { altoCm, anchoCm } = useMemo(
    () => medidasDesdeLargo(largoCm, imagenPx.w, imagenPx.h),
    [largoCm, imagenPx]
  )
  const anchoLogoPct = anchoEnPreviewPct(anchoCm)
  const selectedImage = { id: 1, url: prendaImagen(prenda), alt: prenda }
  const productConfig = {
    tamaño: { width: anchoLogoPct, height: 'auto', aspectRatio: `${imagenPx.w} / ${imagenPx.h}` },
    posiciones: {
      izquierda: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` },
      centro: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` },
      derecha: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` },
      custom: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` }
    }
  }

  const aplicarPosicion = (posicion) => {
    setSideSelected(posicion)
    const pos = defaultsPos[posicion] || defaultsPos.centro
    setLogoPosition({ top: pos.top, left: pos.left })
  }

  const handleArchivo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      const url = reader.result
      setDisenoUrl(url)
      const medidas = await leerMedidasImagen(url)
      setImagenPx(medidas)
      const max = largoMaximo(medidas.w, medidas.h)
      const min = largoMinimo(medidas.w, medidas.h)
      setLargoCm((actual) => Math.min(max, Math.max(min, actual)))
    }
    reader.readAsDataURL(file)
  }

  const agregar = (irCheckout) => {
    if (!disenoUrl) {
      toast.error('Subí tu diseño para continuar')
      return
    }
    addToCart({
      id: `custom-${Date.now()}`,
      nombre: 'Diseño personalizado',
      precio,
      imagen: selectedImage.url,
      prendaImagen: selectedImage.url,
      logoUrl: disenoUrl,
      logoPosition: { top: Number(logoPosition.top), left: Number(logoPosition.left) },
      logoAltoCm: altoCm,
      logoAnchoCm: anchoCm,
      logoWidthPct: anchoLogoPct,
      logoSize: cmAPx(anchoCm),
      sideSelected,
      prenda,
      color,
      talle,
      cantidad
    })
    toast.success('Diseño agregado al carrito')
    if (irCheckout) navigate('/checkout')
  }

  return (
    <section className="pt-28 md:pt-36 mb-16 md:mb-24 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-7xl px-4 md:px-8 lg:px-12 mx-auto">
      <div className="flex flex-col w-full lg:w-2/3">
        <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-[var(--persian-plum-50)]">
          <ProductPreview
            selectedImage={selectedImage}
            sideSelected={sideSelected}
            logoUrl={disenoUrl}
            productConfig={productConfig}
            logoPlaceholder
          />
        </div>
      </div>

      <div className="flex flex-col w-full lg:w-1/3 gap-8">
        <div>
          <h1 className="text-2xl md:text-4xl text-[var(--persian-plum-900)] font-semibold mb-2">
            Personalizá tu prenda
          </h1>
          <p className="text-[var(--persian-plum-800)] mb-2">
            Subí tu diseño, elegí remera o buzo y ubicalo. Lo bordamos a pedido.
          </p>
          <p className="text-xl md:text-2xl text-[var(--persian-plum-900)] font-medium">
            ${precio.toLocaleString('es-AR')}
          </p>
        </div>

        <label className="flex flex-col items-center justify-center gap-2 min-h-[120px] border-2 border-dashed border-[var(--persian-plum-300)] rounded-xl cursor-pointer hover:border-[var(--persian-plum-500)] p-4">
          {disenoUrl ? (
            <img src={disenoUrl} alt="Tu diseño" className="max-h-24 object-contain" />
          ) : (
            <span className="text-center text-[var(--persian-plum-700)] font-medium">
              Subí tu diseño (PNG o JPG)
            </span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleArchivo} />
        </label>

        <div>
          <span className="text-lg font-semibold mb-3 block">Tipo de prenda</span>
          <div className="flex gap-3 flex-wrap">
            {prendas.map((item) => (
              <button
                key={item}
                type="button"
                className={`px-4 py-2 rounded-2xl font-bold ${prenda === item ? 'ring-3 ring-[var(--persian-plum-500)] bg-[var(--persian-plum-100)]' : 'bg-[var(--persian-plum-100)] ring-2 ring-transparent'}`}
                onClick={() => setPrenda(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-lg font-semibold mb-3 block">Talle</span>
          <div className="flex gap-3 flex-wrap">
            {talles.map((item) => (
              <button
                key={item}
                type="button"
                className={`w-12 h-12 rounded-2xl font-bold bg-[var(--persian-plum-100)] ${talle === item ? 'ring-3 ring-[var(--persian-plum-500)]' : 'ring-2 ring-transparent'}`}
                onClick={() => setTalle(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-lg font-semibold mb-3 block">Color</span>
          <div className="flex gap-3 flex-wrap">
            {colores.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`w-8 h-8 rounded-full ${item.class} ${color === item.class ? 'ring-3 ring-[var(--persian-plum-500)]' : 'ring-2 ring-transparent'}`}
                onClick={() => setColor(item.class)}
                aria-label={item.name}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="text-lg font-semibold mb-4 block">Posición del bordado</span>
          <div className="flex gap-3 mb-6 flex-wrap">
            {posicionesLogo.map((posicion) => (
              <button
                key={posicion}
                type="button"
                className={`px-4 py-2 rounded-2xl font-bold bg-[var(--persian-plum-100)] ${sideSelected === posicion.toLowerCase() ? 'ring-3 ring-[var(--persian-plum-500)]' : 'ring-2 ring-transparent'}`}
                onClick={() => aplicarPosicion(posicion.toLowerCase())}
              >
                {posicion}
              </button>
            ))}
          </div>

          <div className="space-y-6 bg-[var(--persian-plum-50)] p-5 rounded-xl">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Posición vertical</span>
                <span className="font-bold text-[var(--persian-plum-900)]">{logoPosition.top}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="60"
                value={logoPosition.top}
                onChange={(e) => {
                  setLogoPosition({ ...logoPosition, top: parseInt(e.target.value, 10) })
                  setSideSelected('custom')
                }}
                className="w-full accent-[var(--persian-plum-600)]"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Posición horizontal</span>
                <span className="font-bold text-[var(--persian-plum-900)]">{logoPosition.left}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={logoPosition.left}
                onChange={(e) => {
                  setLogoPosition({ ...logoPosition, left: parseInt(e.target.value, 10) })
                  setSideSelected('custom')
                }}
                className="w-full accent-[var(--persian-plum-600)]"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Largo del diseño</span>
                <span className="font-bold text-[var(--persian-plum-900)]">{anchoCm} cm</span>
              </label>
              <input
                type="range"
                min={minLargo}
                max={maxLargo}
                step="0.1"
                value={anchoCm}
                onChange={(e) => setLargoCm(parseFloat(e.target.value))}
                className="w-full accent-[var(--persian-plum-600)]"
              />
              <p className="mt-2 text-sm text-[var(--persian-plum-800)]">
                Alto: <strong>{altoCm} cm</strong> (se calcula solo, sin deformar).
              </p>
              <p className="text-xs text-[var(--persian-plum-700)] mt-1">
                Máximo: 18 cm de largo × 13 cm de alto. Mínimo: {minLargo} cm de largo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setCantidad((n) => Math.max(1, n - 1))} className="w-10 h-10 rounded-lg bg-[var(--persian-plum-100)] font-bold">-</button>
          <span className="text-2xl font-semibold w-8 text-center">{cantidad}</span>
          <button type="button" onClick={() => setCantidad((n) => n + 1)} className="w-10 h-10 rounded-lg bg-[var(--persian-plum-100)] font-bold">+</button>
        </div>

        <button type="button" onClick={() => agregar(false)} className="w-full rounded-2xl bg-[var(--persian-plum-600)] text-white text-xl font-medium p-3 hover:bg-[var(--persian-plum-700)]">
          Añadir al carrito
        </button>
        <button type="button" onClick={() => agregar(true)} className="w-full rounded-2xl bg-[var(--persian-plum-300)] text-xl font-medium p-3 hover:bg-[var(--persian-plum-400)]">
          Comprar ahora
        </button>
      </div>
    </section>
  )
}
