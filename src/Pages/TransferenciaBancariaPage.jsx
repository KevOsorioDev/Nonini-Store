import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const TransferenciaBancariaPage = () => {
  const { ordenId } = useParams()
  const [orden, setOrden] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const datosBancarios = {
    banco: 'Banco Galicia',
    titular: 'Nonini Store',
    cbu: '0070999830000012345678',
    alias: 'NONINI.STORE',
    cuit: '20-12345678-9'
  }

  useEffect(() => {
    if (ordenId) {
      cargarOrden()
    }
  }, [ordenId])

  const cargarOrden = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/ordenes/${ordenId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrden(response.data)
    } catch (error) {
      console.error('Error al cargar orden:', error)
      toast.error('Error al cargar los datos de la orden')
    } finally {
      setLoading(false)
    }
  }

  const copiarAlPortapapeles = (texto, campo) => {
    navigator.clipboard.writeText(texto)
    setCopiado(campo)
    toast.success(`${campo} copiado`)
    setTimeout(() => setCopiado(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-900)]"></div>
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Orden no encontrada</h1>
          <Link to="/" className="text-[var(--persian-plum-900)] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-10 w-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Transferencia Bancaria
            </h1>
            <p className="text-gray-600">
              Orden #{orden.id} - Total: <span className="font-bold">${orden.total.toLocaleString()}</span>
            </p>
          </div>

          {/* Instrucciones */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  Importante: Tu orden está pendiente de confirmación
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Realiza la transferencia y envíanos el comprobante por WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Datos bancarios */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Datos para la transferencia
            </h2>

            <div className="space-y-4">
              {/* Banco */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Banco</label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-mono font-medium">{datosBancarios.banco}</span>
                </div>
              </div>

              {/* Titular */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Titular</label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-mono font-medium">{datosBancarios.titular}</span>
                </div>
              </div>

              {/* CBU */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">CBU</label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-mono font-medium text-lg">{datosBancarios.cbu}</span>
                  <button
                    onClick={() => copiarAlPortapapeles(datosBancarios.cbu, 'CBU')}
                    className="ml-2 px-3 py-1 bg-[var(--persian-plum-900)] text-white rounded hover:bg-[var(--persian-plum-800)] transition-colors text-sm"
                  >
                    {copiado === 'CBU' ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Alias */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Alias</label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-mono font-medium text-lg">{datosBancarios.alias}</span>
                  <button
                    onClick={() => copiarAlPortapapeles(datosBancarios.alias, 'Alias')}
                    className="ml-2 px-3 py-1 bg-[var(--persian-plum-900)] text-white rounded hover:bg-[var(--persian-plum-800)] transition-colors text-sm"
                  >
                    {copiado === 'Alias' ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* CUIT */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">CUIT</label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-mono font-medium">{datosBancarios.cuit}</span>
                </div>
              </div>

              {/* Monto */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-600 mb-1">Monto a transferir</label>
                <div className="flex items-center justify-between bg-[var(--persian-plum-50)] p-4 rounded-lg border-2 border-[var(--persian-plum-200)]">
                  <span className="text-2xl font-bold text-[var(--persian-plum-900)]">
                    ${orden.total.toLocaleString()}
                  </span>
                  <button
                    onClick={() => copiarAlPortapapeles(orden.total.toString(), 'Monto')}
                    className="ml-2 px-3 py-1 bg-[var(--persian-plum-900)] text-white rounded hover:bg-[var(--persian-plum-800)] transition-colors text-sm"
                  >
                    {copiado === 'Monto' ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Referencia */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Referencia (incluir en el concepto)
                </label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-mono font-medium">ORDEN-{orden.id}</span>
                  <button
                    onClick={() => copiarAlPortapapeles(`ORDEN-${orden.id}`, 'Referencia')}
                    className="ml-2 px-3 py-1 bg-[var(--persian-plum-900)] text-white rounded hover:bg-[var(--persian-plum-800)] transition-colors text-sm"
                  >
                    {copiado === 'Referencia' ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Siguiente paso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-2">📱 Enviar comprobante</h3>
            <p className="text-sm text-gray-700 mb-4">
              Una vez realizada la transferencia, envianos el comprobante por WhatsApp junto con el número de orden.
            </p>
            <a
              href={`https://wa.me/5491123456789?text=Hola! Realicé una transferencia para la orden ${orden.id} por $${orden.total}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enviar comprobante por WhatsApp
            </a>
          </div>

          {/* Detalles de la orden */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Detalles de tu orden</h3>
            <div className="space-y-3">
              {orden.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.producto.imagenUrl || '/images/placeholder.png'}
                      alt={item.producto.nombre}
                      className="w-12 h-12 object-contain border border-gray-200 rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.producto.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {item.prenda} - {item.talle} - {item.color} - x{item.cantidad}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.precioUnitario * item.cantidad).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botón volver */}
          <div className="mt-8">
            <Link
              to="/"
              className="block text-center px-6 py-3 border-2 border-[var(--persian-plum-900)] text-[var(--persian-plum-900)] rounded-lg hover:bg-[var(--persian-plum-50)] transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferenciaBancariaPage
