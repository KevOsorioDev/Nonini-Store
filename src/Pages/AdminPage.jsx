import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/api'
import DashboardAdmin from '../components/Admin/DashboardAdmin'
import GestionProductos from '../components/Admin/GestionProductos'
import GestionOrdenes from '../components/Admin/GestionOrdenes'
import GestionCategorias from '../components/Admin/GestionCategorias'

export const AdminPage = () => {
  const [seccionActiva, setSeccionActiva] = useState('dashboard')
  const user = authService.getCurrentUser()

  console.log('AdminPage - Usuario actual:', user)
  console.log('AdminPage - Token:', localStorage.getItem('token'))

  // Verificar si el usuario es admin
  if (!user || user.rol !== 'admin') {
    console.log('AdminPage - Acceso denegado. Usuario:', user)
    toast.error('No tienes permisos para acceder a esta sección')
    return <Navigate to="/" replace />
  }

  console.log('AdminPage - Acceso permitido')

  const secciones = [
    { id: 'dashboard', nombre: 'Dashboard', icono: '📊' },
    { id: 'productos', nombre: 'Productos', icono: '📦' },
    { id: 'categorias', nombre: 'Categorías', icono: '🏷️' },
    { id: 'ordenes', nombre: 'Órdenes', icono: '🛒' }
  ]

  const handleCambiarSeccion = (seccionId) => {
    console.log('Cambiando a sección:', seccionId)
    setSeccionActiva(seccionId)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[var(--persian-plum-900)] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-sm text-[var(--persian-plum-200)] mt-1">
                Bienvenido, {user.nombre}
              </p>
            </div>
            <div>
              <Link 
                to="/"
                className='px-4 py-2 bg-[var(--persian-plum-700)] hover:bg-[var(--persian-plum-600)] rounded-lg transition-colors mr-2 inline-block'
              >
                Volver al inicio
              </Link>
              <button
                onClick={() => {
                  authService.logout()
                  window.location.href = '/'
                }}
                className="px-4 py-2 bg-[var(--persian-plum-700)] hover:bg-[var(--persian-plum-600)] rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Menú lateral */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                {secciones.map((seccion) => (
                  <button
                    key={seccion.id}
                    onClick={() => handleCambiarSeccion(seccion.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      seccionActiva === seccion.id
                        ? 'bg-[var(--persian-plum-100)] text-[var(--persian-plum-900)] font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{seccion.icono}</span>
                    <span>{seccion.nombre}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {seccionActiva === 'dashboard' && <DashboardAdmin />}
            {seccionActiva === 'productos' && <GestionProductos />}
            {seccionActiva === 'categorias' && <GestionCategorias />}
            {seccionActiva === 'ordenes' && <GestionOrdenes />}
          </main>
        </div>
      </div>
    </div>
  )
}
