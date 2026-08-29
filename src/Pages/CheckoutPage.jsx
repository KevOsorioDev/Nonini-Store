import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/useCart'
import { authService, pedidosService } from '../services/api'
import { CartItemPreview } from '../components/ProductPreview/CartItemPreview'
import { formatTelefonoAR, telefonoARValido } from '../utils/telefonoAR'
import { obtenerProvincias, buscarLocalidades, validarDireccion, esCABA } from '../utils/georef'
import logo from '../assets/images/nonini_logo.png'

const campoClass =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--persian-plum-500)]'

export const CheckoutPage = () => {
  const { cart, getCartTotal } = useCart()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagando, setPagando] = useState(false)
  const [provincias, setProvincias] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [mostrandoCiudades, setMostrandoCiudades] = useState(false)
  const [verificandoDir, setVerificandoDir] = useState(false)
  const [direccionMatch, setDireccionMatch] = useState(null)
  const [estadoDir, setEstadoDir] = useState('idle')
  const [envio, setEnvio] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    notas: ''
  })
  const navigate = useNavigate()
  const ciudadTimer = useRef(null)
  const dirTimer = useRef(null)

  useEffect(() => {
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
      navigate('/')
      return
    }

    const actual = authService.getCurrentUser()
    setUser(actual)
    if (actual) {
      setEnvio((prev) => ({
        ...prev,
        nombre: actual.nombre || prev.nombre,
        email: actual.email || prev.email,
        telefono: actual.telefono ? formatTelefonoAR(actual.telefono) : prev.telefono
      }))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    obtenerProvincias()
      .then(setProvincias)
      .catch(() => setProvincias([]))
  }, [])

  const actualizar = (campo) => (event) => {
    const value = event.target.value
    setEnvio((prev) => ({ ...prev, [campo]: value }))
    if (campo === 'direccion' || campo === 'ciudad' || campo === 'provincia') {
      setDireccionMatch(null)
      setEstadoDir('idle')
    }
  }

  const actualizarTelefono = (event) => {
    setEnvio((prev) => ({ ...prev, telefono: formatTelefonoAR(event.target.value) }))
  }

  const onFocusTelefono = () => {
    setEnvio((prev) => prev.telefono ? prev : { ...prev, telefono: '+54 ' })
  }

  const onProvinciaChange = (event) => {
    const provincia = event.target.value
    setDireccionMatch(null)
    setEstadoDir('idle')
    setCiudades([])
    setEnvio((prev) => ({
      ...prev,
      provincia,
      ciudad: esCABA(provincia) ? 'Ciudad Autónoma de Buenos Aires' : ''
    }))
  }

  const onCiudadChange = (event) => {
    const ciudad = event.target.value
    setDireccionMatch(null)
    setEstadoDir('idle')
    setEnvio((prev) => ({ ...prev, ciudad }))
    setMostrandoCiudades(true)

    if (ciudadTimer.current) window.clearTimeout(ciudadTimer.current)
    if (esCABA(envio.provincia) || ciudad.trim().length < 2 || !envio.provincia) {
      setCiudades([])
      return
    }

    ciudadTimer.current = window.setTimeout(async () => {
      try {
        const resultados = await buscarLocalidades(ciudad, envio.provincia)
        setCiudades(resultados)
      } catch {
        setCiudades([])
      }
    }, 280)
  }

  const elegirCiudad = (nombre) => {
    setEnvio((prev) => ({ ...prev, ciudad: nombre }))
    setCiudades([])
    setMostrandoCiudades(false)
    setDireccionMatch(null)
    setEstadoDir('idle')
  }

  const consultarDireccion = async (datos) => {
    const direccion = datos.direccion.trim()
    const ciudad = datos.ciudad.trim()
    const provincia = datos.provincia.trim()
    if (!direccion || !ciudad || !provincia) return null
    if (!/\d/.test(direccion)) return null

    setVerificandoDir(true)
    try {
      const match = await validarDireccion({ direccion, ciudad, provincia })
      setDireccionMatch(match)
      setEstadoDir(match ? 'ok' : 'fail')
      return match
    } catch {
      setDireccionMatch(null)
      setEstadoDir('fail')
      return null
    } finally {
      setVerificandoDir(false)
    }
  }

  const onBlurDireccion = () => {
    if (dirTimer.current) window.clearTimeout(dirTimer.current)
    dirTimer.current = window.setTimeout(() => {
      consultarDireccion(envio)
    }, 200)
  }

  const validar = () => {
    if (!envio.nombre.trim()) return 'Ingresá tu nombre'
    if (!envio.email.trim()) return 'Ingresá tu email'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(envio.email)) return 'Email inválido'
    if (!telefonoARValido(envio.telefono)) {
      return 'Ingresá un teléfono válido, por ejemplo +54 11 3067-4537'
    }
    if (!envio.direccion.trim()) return 'Ingresá la dirección'
    if (!/\d/.test(envio.direccion)) return 'Ingresá la altura, por ejemplo Callao 1234'
    if (!envio.ciudad.trim()) return 'Ingresá la ciudad'
    if (!envio.provincia.trim()) return 'Ingresá la provincia'
    return null
  }

  const handlePagoMercadoPago = async () => {
    const errorValidacion = validar()
    if (errorValidacion) {
      toast.error(errorValidacion)
      return
    }

    const match = direccionMatch || await consultarDireccion(envio)
    const envioFinal = match
      ? {
          direccion: match.nomenclatura || envio.direccion.trim(),
          ciudad: match.ciudad || envio.ciudad.trim(),
          provincia: match.provincia || envio.provincia.trim(),
          codigoPostal: envio.codigoPostal.trim(),
          lat: match.lat,
          lon: match.lon
        }
      : {
          direccion: envio.direccion.trim(),
          ciudad: envio.ciudad.trim(),
          provincia: envio.provincia.trim(),
          codigoPostal: envio.codigoPostal.trim()
        }

    if (!match) {
      toast('No encontramos esa calle en el padrón. Podés seguir, pero revisala si hace falta.')
    }

    try {
      setPagando(true)
      const { initPoint } = await pedidosService.pagarMercadoPago({
        items: cart.map((item) => ({
          productoId: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
          talle: item.talle,
          color: item.color,
          prenda: item.prenda
        })),
        cliente: {
          nombre: envio.nombre.trim(),
          email: envio.email.trim(),
          telefono: envio.telefono.trim()
        },
        envio: envioFinal,
        notas: envio.notas.trim()
      })

      if (!initPoint) {
        throw new Error('No se recibió el link de pago')
      }

      window.location.href = initPoint
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo iniciar el pago')
      setPagando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--persian-plum-50)] py-10 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <img src={logo} alt="Nonini Store" className="h-14 sm:h-18 mx-auto mb-4 sm:mb-5" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--persian-plum-900)]">
            Finalizar compra
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--persian-plum-900)] mb-4 sm:mb-5">
              Resumen
            </h2>

            {user?.email && (
              <p className="text-sm text-gray-600 mb-5">
                Sesión: {user.nombre || user.email}
              </p>
            )}

            <div className="space-y-4 sm:space-y-5 mb-5 sm:mb-7">
              {cart.map((item, index) => (
                <div key={item.cartItemId || index} className="flex gap-3 sm:gap-4">
                  <CartItemPreview item={item} width={80} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-[var(--persian-plum-900)] truncate">
                      {item.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.prenda} | Talle: {item.talle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Cantidad: {item.cantidad}
                    </p>
                    <p className="font-medium text-sm sm:text-base text-[var(--persian-plum-700)] mt-1">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-[var(--persian-plum-900)] mt-3 sm:pt-4 pt-3 border-t border-gray-300">
                <span>Total</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--persian-plum-900)] mb-5">
              Datos de envío
            </h2>

            <div className="space-y-3 mb-6">
              <input className={campoClass} placeholder="Nombre y apellido" value={envio.nombre} onChange={actualizar('nombre')} autoComplete="name" />
              <input className={campoClass} type="email" placeholder="Email" value={envio.email} onChange={actualizar('email')} autoComplete="email" />
              <input
                className={campoClass}
                type="tel"
                inputMode="tel"
                placeholder="+54 11 3067-4537"
                value={envio.telefono}
                onChange={actualizarTelefono}
                onFocus={onFocusTelefono}
                autoComplete="tel"
              />

              <select
                className={campoClass}
                value={envio.provincia}
                onChange={onProvinciaChange}
              >
                <option value="">Provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.id} value={provincia.nombre}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>

              <div className="relative">
                <input
                  className={campoClass}
                  placeholder="Ciudad"
                  value={envio.ciudad}
                  onChange={onCiudadChange}
                  onFocus={() => setMostrandoCiudades(true)}
                  onBlur={() => window.setTimeout(() => setMostrandoCiudades(false), 180)}
                  autoComplete="address-level2"
                  disabled={esCABA(envio.provincia)}
                />
                {mostrandoCiudades && ciudades.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-auto text-sm">
                    {ciudades.map((ciudad) => (
                      <li key={ciudad.id}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-[var(--persian-plum-50)]"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            elegirCiudad(ciudad.nombre)
                          }}
                        >
                          {ciudad.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                className={campoClass}
                placeholder="Dirección y altura, ej. Callao 1234"
                value={envio.direccion}
                onChange={actualizar('direccion')}
                onBlur={onBlurDireccion}
                autoComplete="street-address"
              />

              {verificandoDir && (
                <p className="text-xs text-gray-500">Verificando dirección...</p>
              )}
              {!verificandoDir && estadoDir === 'ok' && direccionMatch && (
                <p className="text-xs text-green-700">
                  Dirección encontrada: {direccionMatch.nomenclatura}
                </p>
              )}
              {!verificandoDir && estadoDir === 'fail' && (
                <p className="text-xs text-amber-700">
                  No encontramos esa calle en el padrón oficial. Revisá provincia, ciudad y altura.
                </p>
              )}

              <input className={campoClass} placeholder="Código postal" value={envio.codigoPostal} onChange={actualizar('codigoPostal')} autoComplete="postal-code" />
              <textarea className={campoClass} rows="2" placeholder="Notas (opcional)" value={envio.notas} onChange={actualizar('notas')} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm text-blue-800">
                Te vamos a redirigir a Mercado Pago para pagar. El pedido se guarda en Nonini al instante.
              </p>
            </div>

            <button
              onClick={handlePagoMercadoPago}
              disabled={pagando}
              className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-[#00A8FF] text-white font-medium rounded-lg hover:bg-[#0095E0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pagando ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
