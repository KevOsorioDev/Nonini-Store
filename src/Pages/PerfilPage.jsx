import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, ordenesService } from '../services/api'
import toast from 'react-hot-toast'

const PerfilPage = () => {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(authService.getCurrentUser())
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tabActiva, setTabActiva] = useState('info') // 'info', 'ordenes', 'password'
  const [editando, setEditando] = useState(false)
  const [datosEditar, setDatosEditar] = useState({
    nombre: '',
    apellido: '',
    telefono: ''
  })
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: ''
  })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        const perfilData = await authService.obtenerPerfil()
        const perfilFinal = perfilData?.usuario || perfilData || authService.getCurrentUser()
        setPerfil(perfilFinal)
        setDatosEditar({
          nombre: perfilFinal.nombre || '',
          apellido: perfilFinal.apellido || '',
          telefono: perfilFinal.telefono || ''
        })
        const ordenesData = await ordenesService.obtenerMisOrdenes()
        setOrdenes(Array.isArray(ordenesData) ? ordenesData : ordenesData?.ordenes || [])
      } catch {
        setError('No pudimos cargar tu perfil. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleEditarPerfil = () => {
    setEditando(true)
  }

  const handleCancelarEdicion = () => {
    setEditando(false)
    setDatosEditar({
      nombre: perfil.nombre || '',
      apellido: perfil.apellido || '',
      telefono: perfil.telefono || ''
    })
  }

  const handleGuardarPerfil = async () => {
    try {
      setGuardando(true)
      await authService.actualizarPerfil(datosEditar)
      const perfilActualizado = await authService.obtenerPerfil()
      setPerfil(perfilActualizado?.usuario || perfilActualizado)
      setEditando(false)
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  const handleCambiarPassword = async (e) => {
    e.preventDefault()
    
    if (!passwordData.passwordActual || !passwordData.passwordNueva) {
      toast.error('Completá todos los campos')
      return
    }

    if (passwordData.passwordNueva.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordData.passwordNueva !== passwordData.confirmarPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    try {
      setGuardando(true)
      await authService.cambiarPassword(passwordData.passwordActual, passwordData.passwordNueva)
      toast.success('Contraseña cambiada correctamente')
      setPasswordData({ passwordActual: '', passwordNueva: '', confirmarPassword: '' })
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      const mensaje = error.response?.data?.error || 'Error al cambiar la contraseña'
      toast.error(mensaje)
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <section className="w-[90vw] max-w-5xl mx-auto py-12">
        <p className="text-lg text-[var(--persian-plum-800)]">Cargando perfil...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-[90vw] max-w-5xl mx-auto py-12">
        <p className="text-lg text-red-600">{error}</p>
      </section>
    )
  }

  if (!perfil) {
    navigate('/login')
    return null
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--persian-plum-900)]">Mi Perfil</h1>
              <p className="text-gray-600 mt-1">{perfil.email}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-[var(--persian-plum-600)] hover:text-[var(--persian-plum-700)] font-medium"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setTabActiva('info')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  tabActiva === 'info'
                    ? 'bg-[var(--persian-plum-50)] text-[var(--persian-plum-900)] border-b-2 border-[var(--persian-plum-600)]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Información personal
              </button>
              <button
                onClick={() => setTabActiva('ordenes')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  tabActiva === 'ordenes'
                    ? 'bg-[var(--persian-plum-50)] text-[var(--persian-plum-900)] border-b-2 border-[var(--persian-plum-600)]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Mis órdenes {ordenes.length > 0 && `(${ordenes.length})`}
              </button>
              <button
                onClick={() => setTabActiva('password')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  tabActiva === 'password'
                    ? 'bg-[var(--persian-plum-50)] text-[var(--persian-plum-900)] border-b-2 border-[var(--persian-plum-600)]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Seguridad
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tab: Información Personal */}
            {tabActiva === 'info' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Datos Personales</h2>
                  {!editando && (
                    <button
                      onClick={handleEditarPerfil}
                      className="px-4 py-2 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors"
                    >
                      Editar
                    </button>
                  )}
                </div>

                {editando ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={datosEditar.nombre}
                        onChange={(e) => setDatosEditar({ ...datosEditar, nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                      <input
                        type="text"
                        value={datosEditar.apellido}
                        onChange={(e) => setDatosEditar({ ...datosEditar, apellido: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                        placeholder="Tu apellido"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        value={datosEditar.telefono}
                        onChange={(e) => setDatosEditar({ ...datosEditar, telefono: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                        placeholder="+54 11 1234-5678"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleGuardarPerfil}
                        disabled={guardando}
                        className="px-6 py-2 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors disabled:opacity-50"
                      >
                        {guardando ? 'Guardando...' : '💾 Guardar cambios'}
                      </button>
                      <button
                        onClick={handleCancelarEdicion}
                        disabled={guardando}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Nombre:</span>
                      <span className="text-gray-900">{perfil.nombre || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Apellido:</span>
                      <span className="text-gray-900">{perfil.apellido || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-900">{perfil.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Teléfono:</span>
                      <span className="text-gray-900">{perfil.telefono || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Rol:</span>
                      <span className="text-gray-900 capitalize">{perfil.rol}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Órdenes */}
            {tabActiva === 'ordenes' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Órdenes</h2>
                {ordenes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Aún no tenés órdenes</p>
                    <button
                      onClick={() => navigate('/productos')}
                      className="mt-4 px-6 py-2 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors"
                    >
                      Explorar productos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordenes.map((orden) => (
                      <div
                        key={orden.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Orden #{orden.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(orden.createdAt).toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            orden.estado === 'completada' ? 'bg-green-100 text-green-800' :
                            orden.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                            orden.estado === 'en_camino' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {orden.estado === 'completada' ? 'Completada' :
                             orden.estado === 'cancelada' ? 'Cancelada' :
                             orden.estado === 'en_camino' ? 'En camino' :
                             'Pendiente'}
                          </span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-gray-700">
                            <span>Total:</span>
                            <span className="font-bold text-lg">${orden.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Cambiar Contraseña */}
            {tabActiva === 'password' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cambiar Contraseña</h2>
                <form onSubmit={handleCambiarPassword} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      value={passwordData.passwordActual}
                      onChange={(e) => setPasswordData({ ...passwordData, passwordActual: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                    <input
                      type="password"
                      value={passwordData.passwordNueva}
                      onChange={(e) => setPasswordData({ ...passwordData, passwordNueva: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      value={passwordData.confirmarPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmarPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={guardando}
                    className="w-full px-6 py-3 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors disabled:opacity-50 font-medium"
                  >
                    {guardando ? 'Cambiando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerfilPage
export { PerfilPage }
