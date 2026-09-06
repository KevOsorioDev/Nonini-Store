import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/api'
import DashboardAdmin from '../components/Admin/DashboardAdmin'
import GestionProductos from '../components/Admin/GestionProductos'
import GestionOrdenes from '../components/Admin/GestionOrdenes'
import GestionCategorias from '../components/Admin/GestionCategorias'
import GestionSitio from '../components/Admin/GestionSitio'

export const AdminPage = () => {
  const [seccionActiva, setSeccionActiva] = useState('dashboard')
  const user = authService.getCurrentUser()

  if (!user || user.rol !== 'admin') {
    toast.error('No tienes permisos para acceder a esta sección')
    return <Navigate to="/" replace />
  }

  const secciones = [
    { id: 'dashboard', nombre: 'Dashboard' },
    { id: 'sitio', nombre: 'Sitio' },
    { id: 'productos', nombre: 'Productos' },
    { id: 'categorias', nombre: 'Categorías' },
    { id: 'ordenes', nombre: 'Órdenes' }
  ]

  const handleCambiarSeccion = (seccionId) => {
    setSeccionActiva(seccionId)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[var(--persian-plum-900)] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Panel de Administración</h1>
              <p className="text-sm text-[var(--persian-plum-200)] mt-1">
                Bienvenido, {user.nombre}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                className="px-4 py-2 bg-[var(--persian-plum-700)] hover:bg-[var(--persian-plum-600)] rounded-lg transition-colors inline-block text-sm"
              >
                Volver al inicio
              </Link>
              <button
                onClick={() => {
                  authService.logout()
                  window.location.href = '/'
                }}
                className="px-4 py-2 bg-[var(--persian-plum-700)] hover:bg-[var(--persian-plum-600)] rounded-lg transition-colors text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto">
                {secciones.map((seccion) => (
                  <button
                    key={seccion.id}
                    onClick={() => handleCambiarSeccion(seccion.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                      seccionActiva === seccion.id
                        ? 'bg-[var(--persian-plum-100)] text-[var(--persian-plum-900)] font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{seccion.nombre}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {seccionActiva === 'dashboard' && <DashboardAdmin />}
            {seccionActiva === 'sitio' && <GestionSitio />}
            {seccionActiva === 'productos' && <GestionProductos />}
            {seccionActiva === 'categorias' && <GestionCategorias />}
            {seccionActiva === 'ordenes' && <GestionOrdenes />}
          </main>
        </div>
      </div>
    </div>
  )
}
