import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Modal } from '../Modal/Modal.jsx'
import { useCart } from '../../context/useCart'
import './OpcionesCompra.css'

import buzoFrente from '../../assets/images/buzo_frente.png'
import remeraFrente from '../../assets/images/remera_frente.png'
import remeraOver from '../../assets/images/remera_over.png'
import curlyArrow from '../../assets/images/curly_arrow.png'

export const OpcionesCompra = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [slidePosition, setSlidePosition] = useState(0)
  const openButtonRef = useRef(null)
  const [prendaEleccion, setPrendaEleccion] = useState(null)
  const [colorEleccion, setColorEleccion] = useState(null)
  const [talleEleccion, setTalleEleccion] = useState(null)
  const [disenoPreview, setDisenoPreview] = useState(null)
  const [activeLink, setActiveLink] = useState(null)
  const [activeText, setActiveText] = useState('')
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const handleNext = () => {
    setSlidePosition(prev => prev - 100)
  }

  const handlePrev = () => {
    setSlidePosition(prev => prev + 100)
  }

  const colores = [
    { name: 'Rojo', class: 'bg-red-500' },
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Verde', class: 'bg-green-500' },
    { name: 'Amarillo', class: 'bg-yellow-500' },
    { name: 'Púrpura', class: 'bg-purple-500' },
    { name: 'Negro', class: 'bg-black' }
  ]

  const talles = ['S', 'M', 'L', 'XL']

  const handleDisenoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDisenoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleConfirmarDiseno = () => {
    if (!prendaEleccion) {
      toast.error('Elegí una prenda')
      return
    }
    if (!colorEleccion) {
      toast.error('Elegí un color')
      return
    }
    if (!talleEleccion) {
      toast.error('Elegí un talle')
      return
    }
    if (!disenoPreview) {
      toast.error('Subí tu diseño')
      return
    }

    const colorClass = colores.find((c) => c.name === colorEleccion)?.class || colorEleccion
    const prendaImagen = prendaEleccion === 'Remera'
      ? remeraFrente
      : prendaEleccion === 'Remera Oversize'
        ? remeraOver
        : buzoFrente

    addToCart({
      id: `custom-${Date.now()}`,
      nombre: 'Diseño personalizado',
      precio: 7000,
      imagen: prendaImagen,
      prendaImagen,
      logoUrl: disenoPreview,
      logoPosition: { top: 22, left: 50 },
      logoSize: 90,
      prenda: prendaEleccion,
      color: colorClass,
      talle: talleEleccion,
      cantidad: 1
    })

    toast.success('Diseño agregado al carrito')
    setOpen(false)
    setSlidePosition(0)
    setPrendaEleccion(null)
    setColorEleccion(null)
    setTalleEleccion(null)
    setDisenoPreview(null)
  }

  return (
    <section ref={sectionRef} className={`opciones-compra ${activeLink ? 'has-active' : ''} ${isVisible ? 'visible' : ''}`}>

      {/* ---------- TÍTULO ---------- */}
      <h2 className="opciones-compra__title">
        Elige tu manera de comprar en Nonini!
      </h2>

      {/* ---------- ARROWS ---------- */}
      <img src={curlyArrow} className="curly-arrow arrow-left" alt="Flecha curva izquierda" />
      <img src={curlyArrow} className="curly-arrow arrow-right" alt="Flecha curva derecha" />

      {/* ---------- OPCIONES ---------- */}
      <div
        className={`opciones-compra__options ${activeLink ? 'has-overlay-active' : ''}`}
        onMouseLeave={() => { setActiveLink(null); setActiveText(''); }}
      >
        <span
          className={`opciones-compra__link ${activeLink === 1 ? 'active' : ''}`}
          onClick={() => navigate('/productos')}
          onMouseEnter={() => { setActiveLink(1); setActiveText('Quiero usar un diseño ya creado por Nonini!'); }}
        >
          Quiero usar un diseño ya creado por Nonini!
        </span>

        <span
          className={`opciones-compra__link ${activeLink === 2 ? 'active' : ''}`}
          onClick={() => setOpen(true)}
          ref={openButtonRef}
          onMouseEnter={() => { setActiveLink(2); setActiveText('Me siento creativo y quiero enviar mi diseño!'); }}
        >
          Me siento creativo y quiero enviar mi diseño!
        </span>

        <div className={`hover-overlay left-overlay ${activeLink === 1 ? 'active' : ''}`}
          onMouseLeave={() => { setActiveLink(null); setActiveText(''); }}
        >
          <span className="overlay-text">{activeText}</span>
        </div>
        <div className={`hover-overlay right-overlay ${activeLink === 2 ? 'active' : ''}`}
          onMouseLeave={() => { setActiveLink(null); setActiveText(''); }}
        >
          <span className="overlay-text">{activeText}</span>
        </div>
      </div>

      {/* ---------- OVERLAY INVISIBLE PARA CERRAR ---------- */}
      {activeLink && (
        <div 
          className="opciones-compra__backdrop"
          onClick={() => { setActiveLink(null); setActiveText(''); }}
          onMouseEnter={() => { setActiveLink(null); setActiveText(''); }}
        />
      )}

      {/* ---------- MODAL ---------- */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <h2 className="text-3xl font-bold text-[var(--persian-plum-900)] mb-4">
          Creá tu diseño
        </h2>

        <p className="text-lg text-[var(--persian-plum-700)] mb-6">
          Sube tu diseño y nosotros lo haremos realidad en tu prenda favorita.
        </p>

        <h3 className='text-center text-2xl font-semibold mb-4'>
          Personaliza tu prenda
        </h3>

        <p className='text-center text-base mb-6'>
          Subi tu diseño y eligí tus opciones de personalizacion.
        </p>

        {/* Contenedor con overflow hidden para el slider */}
        <div className="overflow-hidden w-full">

          {/* Contenedor que se desliza horizontalmente */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${slidePosition}%)` }}
          >

            {/* Vista 1: Elección de prenda */}
            <div className="min-w-full min-h-[380px] md:min-h-[500px] flex flex-col gap-4">
              <span className="text-center text-xl font-medium">
                1. Elección de prenda
              </span>

              <div className='flex justify-evenly gap-4 w-[100%]'>
                <button
                  className={
                    `flex justify-center items-center w-[30%] h-[300px] border-2 border-[var(--persian-plum-300)] rounded-xl hover:border-[var(--persian-plum-500)] transition-colors cursor-pointer
                    ${prendaEleccion === "Buzo"
                      ? "border-3 border-[var(--persian-plum-500)]"
                      : ""
                    }
                  `}
                  onClick={() => { setPrendaEleccion("Buzo") }}
                >
                  <img src={buzoFrente} alt="Buzo" className='w-[50%] h-auto' />
                </button>

                <button
                  className={
                    `flex justify-center items-center w-[30%] h-[300px] border-2 border-[var(--persian-plum-300)] rounded-xl hover:border-[var(--persian-plum-500)] transition-colors cursor-pointer
                    ${prendaEleccion === "Remera"
                      ? "border-3 border-[var(--persian-plum-500)]"
                      : ""
                    }
                  `}
                  onClick={() => { setPrendaEleccion("Remera") }}
                >
                  <img src={remeraFrente} alt="Remera" className='w-[50%] h-auto' />
                </button>

                <button
                  className={
                    `flex justify-center items-center w-[30%] h-[300px] border-2 border-[var(--persian-plum-300)] rounded-xl hover:border-[var(--persian-plum-500)] transition-colors cursor-pointer
                    ${prendaEleccion === "Remera Oversize"
                      ? "border-3 border-[var(--persian-plum-500)]"
                      : ""
                    }
                  `}
                  onClick={() => { setPrendaEleccion("Remera Oversize") }}
                >
                  <img src={remeraOver} alt="Remera Oversize" className='w-[50%] h-auto' />
                </button>
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={handleNext}
                className="w-[70%] mx-auto mt-auto rounded-xl px-8 py-3 font-medium text-white bg-[var(--persian-plum-500)] hover:bg-[var(--persian-plum-600)] transition-colors cursor-pointer"
              >
                Siguiente →
              </button>
            </div>

            {/* Vista 2: Selección de colores y talles */}
            <div className="min-w-full min-h-[380px] md:min-h-[500px] flex flex-col gap-6">
              <span className="text-center text-xl font-medium">
                2. Selección de color y talle
              </span>

              {/* Colores */}
              <div className="flex flex-col justify-center items-center gap-3">
                <span className="text-lg font-semibold">Colores</span>
                <div className='flex justify-center gap-4 w-[100%] flex-wrap'>
                  {colores.map((color, i) => (
                    <button
                      key={i}
                      className={`
                        w-16 h-16 rounded-full ${color.class}
                        border-4 transition-all cursor-pointer
                        ${colorEleccion === color.name
                          ? 'border-[var(--persian-plum-500)] scale-110'
                          : 'border-transparent hover:border-[var(--persian-plum-400)]'
                        }
                      `}
                      onClick={() => setColorEleccion(color.name)}
                      aria-label={`Seleccionar color ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Talles */}
              <div className="flex flex-col justify-center items-center gap-3">
                <span className="text-lg font-semibold">Talles</span>
                <div className="flex justify-center gap-4">
                  {talles.map((talle) => (
                    <button
                      key={talle}
                      className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center font-bold cursor-pointer
                        bg-[var(--persian-plum-100)] text-[var(--persian-plum-900)]
                        transition-all duration-200
                        ${talleEleccion === talle
                          ? 'ring-4 ring-[var(--persian-plum-500)] scale-110'
                          : 'ring-2 ring-transparent hover:ring-[var(--persian-plum-400)]'
                        }
                      `}
                      onClick={() => setTalleEleccion(talle)}
                      aria-label={`Seleccionar talle ${talle}`}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="flex gap-4 w-[70%] mx-auto mt-auto">
                <button
                  onClick={handlePrev}
                  className="flex-1 rounded-xl px-8 py-3 font-medium text-[var(--persian-plum-900)] bg-[var(--persian-plum-200)] hover:bg-[var(--persian-plum-300)] transition-colors cursor-pointer"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 rounded-xl px-8 py-3 font-medium text-white bg-[var(--persian-plum-500)] hover:bg-[var(--persian-plum-600)] transition-colors cursor-pointer"
                >
                  Siguiente →
                </button>
              </div>
            </div>

            {/* Vista 3: Confirmación */}
            <div className="min-w-full min-h-[380px] md:min-h-[500px] flex flex-col gap-4">
              <span className="text-center text-xl font-medium">
                3. ¡Envía tu diseño y confirma el pedido!
              </span>

              <p className="text-center text-base mb-6">
                Revisá tu diseño y confirmá para agregar al carrito
              </p>

              <label className="flex flex-col items-center justify-center gap-3 w-[70%] mx-auto min-h-[140px] border-2 border-dashed border-[var(--persian-plum-300)] rounded-xl cursor-pointer hover:border-[var(--persian-plum-500)] transition-colors p-4">
                {disenoPreview ? (
                  <img src={disenoPreview} alt="Diseño subido" className="max-h-28 object-contain" />
                ) : (
                  <span className="text-center text-[var(--persian-plum-700)]">
                    Tocá para subir tu diseño
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDisenoChange}
                />
              </label>

              <div className="flex gap-4 w-[70%] mx-auto mt-auto">
                <button
                  onClick={handlePrev}
                  className="flex-1 rounded-xl px-8 py-3 font-medium text-[var(--persian-plum-900)] bg-[var(--persian-plum-200)] hover:bg-[var(--persian-plum-300)] transition-colors cursor-pointer"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleConfirmarDiseno}
                  className="flex-1 rounded-xl px-8 py-3 font-medium text-white bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Confirmar ✓
                </button>
              </div>
            </div>

          </div>
        </div>
      </Modal>
    </section>
  )
}
