import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { categoriasService } from '../../services/api'

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    slug: ''
  })

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      setLoading(true)
      const response = await categoriasService.obtenerTodas()
      setCategorias(response)
    } catch (error) {
      toast.error('Error al cargar categorías')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generar slug si se está escribiendo el nombre
    if (name === 'nombre' && !categoriaEditando) {
      const slugGenerado = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Quitar caracteres especiales
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno solo
        .trim()
      
      setFormData(prev => ({
        ...prev,
        slug: slugGenerado
      }))
    }
  }

  const abrirModal = (categoria = null) => {
    console.log('Abriendo modal con categoría:', categoria)
    if (categoria) {
      setCategoriaEditando(categoria)
      setFormData({
        nombre: categoria.nombre,
        slug: categoria.slug
      })
    } else {
      setCategoriaEditando(null)
      setFormData({ nombre: '', slug: '' })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    console.log('Cerrando modal')
    setModalAbierto(false)
    setCategoriaEditando(null)
    setFormData({ nombre: '', slug: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Enviando formulario:', formData)

    if (!formData.nombre.trim() || !formData.slug.trim()) {
      toast.error('Nombre y slug son obligatorios')
      return
    }

    try {
      if (categoriaEditando) {
        // Actualizar
        console.log('Actualizando categoría:', categoriaEditando.id, formData)
        await categoriasService.actualizar(categoriaEditando.id, formData)
        toast.success('Categoría actualizada exitosamente')
      } else {
        // Crear
        console.log('Creando categoría:', formData)
        await categoriasService.crear(formData)
        toast.success('Categoría creada exitosamente')
      }

      cerrarModal()
      cargarCategorias()
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al guardar categoría'
      console.error('Error al guardar:', error)
      toast.error(mensaje)
    }
  }

  const handleEliminar = async (id, nombre) => {
    console.log('Intentando eliminar:', id, nombre)
    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) {
      return
    }

    try {
      console.log('Eliminando categoría:', id)
      await categoriasService.eliminar(id)
      toast.success('Categoría eliminada exitosamente')
      cargarCategorias()
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al eliminar categoría'
      console.error('Error al eliminar:', error)
      toast.error(mensaje)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-900)]"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
        <button
          onClick={() => abrirModal()}
          className="px-4 py-2 bg-[var(--persian-plum-900)] text-white rounded-lg hover:bg-[var(--persian-plum-800)] transition-colors"
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categorias.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay categorías creadas
                </td>
              </tr>
            ) : (
              categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {categoria.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {categoria.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categoria.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categoria._count?.productos || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => abrirModal(categoria)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(categoria.id, categoria.nombre)}
                      className="text-red-600 hover:text-red-900"
                      disabled={categoria._count?.productos > 0}
                      title={categoria._count?.productos > 0 ? 'No se puede eliminar: tiene productos asociados' : ''}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de crear/editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--persian-plum-500)]"
                  placeholder="Ej: Remeras"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL amigable) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--persian-plum-500)]"
                  placeholder="Ej: remeras"
                  pattern="[a-z0-9-]+"
                  title="Solo letras minúsculas, números y guiones"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo letras minúsculas, números y guiones
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--persian-plum-900)] text-white rounded-lg hover:bg-[var(--persian-plum-800)] transition-colors"
                >
                  {categoriaEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionCategorias
