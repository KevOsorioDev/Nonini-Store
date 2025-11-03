import { StarIcon } from '../icons/star/StarIcon'
import { useEffect, useState, useRef } from 'react'
import { Modal } from '../Modal/Modal.jsx'
import './Instrucciones.css'

import buzoFrente from '../../assets/images/buzo_frente.png'
import remeraFrente from '../../assets/images/remera_frente.png'

export const Instrucciones = () => {
  // Estado de scroll (para animaciones de estrellas)
  const [scrolled, setScrolled] = useState(false)
  const [blink, setBlink] = useState(false)

  // Estado del modal (true = abierto)
  const [open, setOpen] = useState(false)

  // Estado para el slide del contenido (0 = vista 1, -100 = vista 2, -200 = vista 3)
  const [slidePosition, setSlidePosition] = useState(0)

  // Ref al botón que abre el modal, para devolver el foco al cerrarlo
  const openButtonRef = useRef(null)

  // Estado para la eleccion de prenda en caso de ser personalizado
  const [prendaEleccion, setPrendaEleccion] = useState(null)

  // Estado para el color seleccionado
  const [colorEleccion, setColorEleccion] = useState(null)

  // Estado para el talle seleccionado
  const [talleEleccion, setTalleEleccion] = useState(null)

  // Función para avanzar a la siguiente vista
  const handleNext = () => {
    setSlidePosition(prev => prev - 100)
  }

  // Función para retroceder a la vista anterior
  const handlePrev = () => {
    setSlidePosition(prev => prev + 100)
  }

  // Colores y talles disponibles
  const colores = [
    { name: 'Rojo', class: 'bg-red-500' },
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Verde', class: 'bg-green-500' },
    { name: 'Amarillo', class: 'bg-yellow-500' },
    { name: 'Púrpura', class: 'bg-purple-500' },
    { name: 'Negro', class: 'bg-black' }
  ]

  const talles = ['S', 'M', 'L', 'XL']

  // Detecta si el usuario ha hecho scroll

  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hace parpadear las estrellas cuando hay scroll
  useEffect(() => {
    let interval
    if (scrolled) {
      interval = setInterval(() => setBlink(b => !b), 400)
    } else {
      setBlink(false)
    }
    return () => clearInterval(interval)
  }, [scrolled])

  const stars = [
    { key: 'left-1', blinkOn: true },
    { key: 'left-2', blinkOn: false },
    { key: 'left-3', blinkOn: true },
    { key: 'right-1', blinkOn: false },
    { key: 'right-2', blinkOn: true },
    { key: 'right-3', blinkOn: false }
  ]

  const pasos = [
    "Primero, buscá o subí tu diseño favorito!",
    "Elegí cuál sería tu prenda ideal y calculá cuál sería tu talle ideal ;)",
    "Personalizá bien tu prenda y envíalo al carrito",
    "¡Listo! Una vez pagado queda esperar que llegue a tu casa!"
  ]

  return (
    <div className={`instructions flex flex-col items-center text-center ${scrolled ? 'instructions--scrolled' : ''}`}>
      
      {/* ---------- TÍTULO Y ESTRELLAS ---------- */}
      <div className="flex items-end justify-center gap-4">
        <div className="instructions__title-container">
          {stars.map(({ key, blinkOn }) => (
            <StarIcon
              key={key}
              className={`star star--${key} ${
                blinkOn 
                  ? (blink ? 'star--blink-on' : 'star--blink-off')
                  : (blink ? 'star--blink-off' : 'star--blink-on')
              }`}
            />
          ))}
          
          <h3 className="instructions__title">
            ¿Cómo trabajamos?
          </h3>
        </div>
      </div>

      {/* ---------- PASOS DE PROCESO ---------- */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-12 mt-15 w-full max-w-[85vw]">
        {pasos.map((texto, i) => (
          <div key={i} className="instructions__step">
            <div className="instructions__step-image" />
            <span className="instructions__step-text">
              {texto}
            </span>
          </div>
        ))}
      </div>

      {/* ---------- BOTONES ---------- */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 w-full">
        <button className="instructions__link">
          Quiero usar un diseño ya creado por Nonini!
        </button>

        <button 
          className="instructions__link"
          onClick={() => setOpen(true)} 
          ref={openButtonRef}
        >
          Me siento creativo y quiero enviar mi diseño!
        </button>
      </div>

      {/* ---------- MODAL ---------- */}
      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        returnFocusRef={openButtonRef}
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
            <div className="min-w-full min-h-[500px] flex flex-col gap-4">
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
            <div className="min-w-full min-h-[500px] flex flex-col gap-6">
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
            <div className="min-w-full min-h-[500px] flex flex-col gap-4">
              <span className="text-center text-xl font-medium">
                3. ¡Envía tu diseño y confirma el pedido!
              </span>

              <p className="text-center text-base mb-6">
                Revisá tu diseño y confirmá para agregar al carrito
              </p>

              <div className="flex gap-4 w-[70%] mx-auto mt-auto">
                <button 
                  onClick={handlePrev}
                  className="flex-1 rounded-xl px-8 py-3 font-medium text-[var(--persian-plum-900)] bg-[var(--persian-plum-200)] hover:bg-[var(--persian-plum-300)] transition-colors cursor-pointer"
                >
                  ← Anterior
                </button>
                <button 
                  className="flex-1 rounded-xl px-8 py-3 font-medium text-white bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Confirmar ✓
                </button>
              </div>
            </div>

          </div>
        </div>
      </Modal>
    </div>
  )
}
