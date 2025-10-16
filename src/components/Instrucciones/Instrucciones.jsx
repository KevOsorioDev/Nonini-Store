import { useEffect, useMemo, useState } from 'react'
import { StarIcon } from '../icons/star/StarIcon'
import '../../index.css'

export const Instrucciones = () => {
  const [scrolled, setScrolled] = useState(false)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let interval
    if (scrolled) {
      interval = setInterval(() => setBlink(b => !b), 400)
    } else {
      setBlink(false)
    }
    return () => clearInterval(interval)
  }, [scrolled])

  const stars = useMemo(() => ([
    {
      key: 'left-1',
      position: 'top-[50%] left-[-10%]',
      size: 'w-8 h-8',
      color: 'text-[var(--persian-plum-400)]',
      showWhenBlink: true
    },
    {
      key: 'left-2',
      position: 'top-[10%] left-[0%]',
      size: 'w-5 h-5',
      color: 'text-[var(--persian-plum-950)]',
      showWhenBlink: false
    },
    {
      key: 'left-3',
      position: 'top-[105%] left-[-3%]',
      size: 'w-6 h-6',
      color: 'text-[var(--persian-plum-700)]',
      showWhenBlink: true
    },
    {
      key: 'right-1',
      position: 'top-[50%] right-[-10%]',
      size: 'w-8 h-8',
      color: 'text-[var(--persian-plum-950)]',
      showWhenBlink: false
    },
    {
      key: 'right-2',
      position: 'top-[10%] right-[0%]',
      size: 'w-5 h-5',
      color: 'text-[var(--persian-plum-700)]',
      showWhenBlink: true
    },
    {
      key: 'right-3',
      position: 'top-[105%] right-[-3%]',
      size: 'w-6 h-6',
      color: 'text-[var(--persian-plum-400)]',
      showWhenBlink: false
    }
  ]), [])

  const pasos = [
    "Primero, buscá o subí tu diseño favorito!",
    "Elegí cuál sería tu prenda ideal y calculá cuál sería tu talle ideal ;)",
    "Personalizá bien tu prenda y envíalo al carrito",
    "¡Listo! Una vez pagado queda esperar que llegue a tu casa!"
  ]

  return (
    <div
      className={`
        mx-auto mt-0
        w-[85vw] h-auto
        flex flex-col items-center text-center
        rounded-2xl
        transition-all duration-700
        ${scrolled ? 'translate-y-[150px] scale-110' : ''}
      `}
    >
      <div className="relative flex items-end justify-center gap-4">
        <div className="relative inline-block">
          {/* Estrellas normales */}
          {stars.map(({ key, position, size, color, showWhenBlink }) => (
            <StarIcon
              key={key}
              className={`
                absolute ${position}
                ${size}
                ${color}
                transition-opacity duration-300
                ${showWhenBlink ? (blink ? 'opacity-100' : 'opacity-30') : (blink ? 'opacity-30' : 'opacity-100')}
              `}
            />
          ))}
          <h3
            className="
              mt-5
              text-5xl font-medium leading-tight
              text-[var(--persian-plum-800)]
              transition-all duration-700
            "
          >
            ¿Como trabajamos?
          </h3>
        </div>
      </div>

      {/* Cuadrados de pasos */}
      <div className="
        w-full max-w-[85vw] h-auto mt-15
        flex flex-row justify-center items-stretch gap-12
      ">
        {pasos.map((texto, i) => (
          <div key={i} className="
            flex flex-col items-center
            w-full max-w-[250px]
          ">
            <div className="
              w-full h-[200px]
              bg-[var(--persian-plum-900)]
              rounded-xl
              p-4
            " />
            <span className="
              mt-4
              text-base text-center font-semibold
              text-[var(--persian-plum-900)]
              block
            ">
              {texto}
            </span>
          </div>
        ))}
      </div>

      {/* Links de acción */}
      <div className="
        w-full mt-8
        flex justify-center items-center gap-8
      ">
        <a
          href="#"
          className="
            px-6 py-2
            text-lg font-semibold
            text-[var(--persian-plum-900)]
            no-underline rounded
            transition-colors duration-200
            hover:bg-[var(--persian-plum-50)]
          "
          style={{ textDecoration: 'none' }}
        >
          Quiero usar un diseño ya creado
        </a>
        <a
          href="#"
          className="
            px-6 py-2
            text-lg font-semibold
            text-[var(--persian-plum-900)]
            no-underline rounded
            transition-colors duration-200
            hover:bg-[var(--persian-plum-50)]
          "
          style={{ textDecoration: 'none' }}
        >
          Me siento creativo y quiero enviar mi diseño!
        </a>
      </div>
    </div>
  )
}