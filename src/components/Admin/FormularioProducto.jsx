import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { productosService, categoriasService } from '../../services/api'
import { ProductPreview } from '../ProductPreview/ProductPreview'
import buzoFrente from '../../assets/images/buzo_frente.png'
import remeraFrente from '../../assets/images/remera_frente.png'
import remeraOver from '../../assets/images/remera_over.png'

const FormularioProducto = ({ producto, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    activo: true,
    imagenUrl: '',
    disenoUrl: '',
    disenoConfig: {
      Buzo: {
        izquierda: { top: 15, left: 30, size: 120 },
        centro: { top: 15, left: 50, size: 120 },
        derecha: { top: 15, left: 70, size: 120 }
      },
      Remera: {
        izquierda: { top: 12, left: 30, size: 110 },
        centro: { top: 12, left: 50, size: 110 },
        derecha: { top: 12, left: 70, size: 110 }
      },
      'Remera Oversize': {
        izquierda: { top: 18, left: 30, size: 140 },
        centro: { top: 18, left: 50, size: 140 },
        derecha: { top: 18, left: 70, size: 140 }
      }
    },
    talles: [
      { talle: 'S', stock: 0 },
      { talle: 'M', stock: 0 },
      { talle: 'L', stock: 0 },
      { talle: 'XL', stock: 0 }
    ]
  })
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [disenoPreview, setDisenoPreview] = useState(null)
  const [previewPrenda, setPreviewPrenda] = useState('Buzo')
  const [positionPreset, setPositionPreset] = useState('centro')
  const [tempPos, setTempPos] = useState({ top: 15, left: 50 })
  const [tempSize, setTempSize] = useState(120)

  useEffect(() => {
    cargarCategorias()
    if (producto) {
      const disenoConfig = producto.disenoConfig || formData.disenoConfig
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        categoriaId: producto.categoriaId || '',
        activo: producto.activo !== undefined ? producto.activo : true,
        imagenUrl: producto.imagenUrl || '',
        disenoUrl: producto.disenoUrl || '',
        disenoConfig: disenoConfig,
        talles: producto.talles?.length > 0 ? producto.talles : formData.talles
      })
      setImagenPreview(producto.imagenUrl)
      setDisenoPreview(producto.disenoUrl)
      
      // Cargar configuración de diseño guardada
      if (disenoConfig) {
        // Cargar valores para la prenda y preset actuales
        const currentCfg = disenoConfig[previewPrenda]?.[positionPreset] || disenoConfig.Buzo?.centro
        if (currentCfg) {
          setTempPos({ top: currentCfg.top, left: currentCfg.left })
          setTempSize(currentCfg.size || 120)
        }
      }
    }
  }, [producto])

  // sync temp values when previewPrenda or positionPreset changes
  useEffect(() => {
    // load selected preset for current previewPrenda from formData
    const cfg = formData.disenoConfig?.[previewPrenda]?.[positionPreset]
    if (cfg && cfg.top !== undefined && cfg.left !== undefined) {
      setTempPos({ top: cfg.top, left: cfg.left })
      setTempSize(cfg.size || 120)
    } else {
      // Si no hay configuración guardada, usar valores por defecto según el preset
      const defaultPositions = {
        izquierda: { top: 15, left: 25, size: 120 },
        centro: { top: 15, left: 50, size: 120 },
        derecha: { top: 15, left: 75, size: 120 },
        custom: { top: 15, left: 50, size: 120 }
      }
      const defaults = defaultPositions[positionPreset] || defaultPositions.centro
      setTempPos({ top: defaults.top, left: defaults.left })
      setTempSize(defaults.size)
    }
  }, [previewPrenda, positionPreset, JSON.stringify(formData.disenoConfig)])

  const cargarCategorias = async () => {
    try {
      const data = await categoriasService.obtenerTodas()
      setCategorias(data)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTalleChange = (index, value) => {
    const newTalles = [...formData.talles]
    newTalles[index].stock = parseInt(value) || 0
    setFormData(prev => ({ ...prev, talles: newTalles }))
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no puede superar los 5MB')
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview(reader.result)
        setFormData(prev => ({ ...prev, imagenUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const event = { target: { files: [file] } }
      handleImagenChange(event)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDisenoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no puede superar los 5MB')
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setDisenoPreview(reader.result)
        setFormData(prev => ({ ...prev, disenoUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDisenoDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const event = { target: { files: [file] } }
      handleDisenoChange(event)
    }
  }

  const handleSaveDisenoConfig = () => {
    setFormData(prev => ({
      ...prev,
      disenoConfig: {
        ...prev.disenoConfig,
        [previewPrenda]: {
          ...(prev.disenoConfig?.[previewPrenda] || {}),
          [positionPreset]: { top: tempPos.top, left: tempPos.left, size: tempSize }
        }
      }
    }))
    toast.success('Configuración de diseño guardada para ' + previewPrenda + ' (' + positionPreset + ')')
  }

  const handleResetDisenoConfig = (prenda = previewPrenda, preset = positionPreset) => {
    const defaults = { top: 15, left: 50, size: 120 }
    setFormData(prev => ({
      ...prev,
      disenoConfig: {
        ...prev.disenoConfig,
        [prenda]: {
          ...(prev.disenoConfig?.[prenda] || {}),
          [preset]: defaults
        }
      }
    }))
    setTempPos({ top: defaults.top, left: defaults.left })
    setTempSize(defaults.size)
    toast.success('Restablecido a valores por defecto para ' + prenda + ' (' + preset + ')')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🚀 handleSubmit ejecutado');
    console.log('📋 formData actual:', formData);

    // Validaciones
    if (!formData.nombre || !formData.precio) {
      console.log('❌ Validación fallida: nombre o precio faltante');
      toast.error('Por favor completa nombre y precio')
      return
    }

    const categoriaIdNum = parseInt(formData.categoriaId);
    if (isNaN(categoriaIdNum) || categoriaIdNum <= 0) {
      console.log('❌ Validación fallida: categoriaId inválido', formData.categoriaId, categoriaIdNum);
      toast.error('Por favor selecciona una categoría válida')
      return
    }

    // Validar que se haya subido una imagen
    if (!formData.imagenUrl) {
      console.log('❌ Validación fallida: imagenUrl faltante');
      toast.error('Por favor sube una imagen del producto')
      return
    }

    // Validar que se haya subido un diseño
    if (!formData.disenoUrl) {
      console.log('❌ Validación fallida: disenoUrl faltante');
      toast.error('Por favor sube una imagen del diseño/logo')
      return
    }
    
    console.log('✅ Todas las validaciones pasaron');

    try {
      console.log('🔄 Iniciando envío, setting loading = true');
      setLoading(true)

      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        activo: formData.activo,
        imagenUrl: formData.imagenUrl,
        disenoUrl: formData.disenoUrl,
        disenoConfig: formData.disenoConfig,
        talles: formData.talles
      }

      // Solo enviar categoriaId si tiene un valor válido
      const categoriaIdNum = parseInt(formData.categoriaId);
      if (!isNaN(categoriaIdNum) && categoriaIdNum > 0) {
        dataToSend.categoriaId = categoriaIdNum;
      }

      console.log('📤 Enviando datos de actualización:', dataToSend);

      let productoCreado = null;
      
      if (producto) {
        // Editar producto existente
        console.log('📝 Actualizando producto existente:', producto.id);
        await productosService.actualizar(producto.id, dataToSend)
        toast.success('Producto actualizado correctamente')
      } else {
        // Crear nuevo producto
        console.log('📤 Enviando datos de creación:', dataToSend);
        productoCreado = await productosService.crear(dataToSend)
        console.log('✅ Producto creado:', productoCreado);
        toast.success('Producto creado correctamente')
      }

      console.log('✅ Operación completada exitosamente');
      
      // Esperar un momento para que se vea el toast
      setTimeout(() => {
        onGuardar(productoCreado)
      }, 500)
    } catch (error) {
      console.error('❌ Error al guardar producto:', error)
      console.error('❌ Detalles del error:', error.response?.data || error.message)
      console.error('❌ Status del error:', error.response?.status)
      
      // Mejorar el manejo de errores
      let errorMessage = 'Error al guardar el producto'
      if (error.response?.status === 401) {
        errorMessage = 'No tienes permisos para realizar esta acción. Inicia sesión como administrador.'
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      console.log('🔄 Finalizando, setting loading = false');
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[var(--persian-plum-900)]">
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                placeholder="Ej: Buzo Nike Air"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado activo */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                  className="w-4 h-4 text-[var(--persian-plum-600)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--persian-plum-500)] focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Producto activo (visible en la tienda)</span>
              </label>
            </div>

            {/* Talles y stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock por talle
              </label>
              <div className="grid grid-cols-4 gap-3">
                {formData.talles.map((talleData, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-600 mb-1 text-center font-medium">
                      {talleData.talle}
                    </label>
                    <input
                      type="number"
                      value={talleData.stock}
                      onChange={(e) => handleTalleChange(index, e.target.value)}
                      min="0"
                      className="w-full px-2 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del producto *
            </label>
            
            {/* Zona de drag & drop */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--persian-plum-500)] transition-colors cursor-pointer"
            >
              {imagenPreview ? (
                <div className="space-y-4">
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="max-h-64 mx-auto object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagenPreview(null)
                      setFormData(prev => ({ ...prev, imagenUrl: '' }))
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar imagen
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Arrastra una imagen aquí o
                  </p>
                  <label className="inline-block px-4 py-2 bg-[var(--persian-plum-100)] text-[var(--persian-plum-700)] rounded-lg hover:bg-[var(--persian-plum-200)] cursor-pointer transition-colors">
                    Seleccionar archivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagenChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 5MB
                  </p>
                </div>
              )}
            </div>

            {/* URL de imagen alternativa */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O ingresa una URL de imagen
              </label>
              <input
                type="url"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={(e) => {
                  handleChange(e)
                  if (e.target.value) {
                    setImagenPreview(e.target.value)
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
        </div>

        {/* Imagen del diseño/logo - Fila completa */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del diseño/logo *
          </label>
          
          <div
            onDrop={handleDisenoDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--persian-plum-500)] transition-colors cursor-pointer"
          >
            {disenoPreview ? (
              <div className="space-y-4">
                <img
                  src={disenoPreview}
                  alt="Preview diseño"
                  className="max-h-48 mx-auto object-contain rounded-lg bg-gray-100 p-4"
                />
                <button
                  type="button"
                  onClick={() => {
                    setDisenoPreview(null)
                    setFormData(prev => ({ ...prev, disenoUrl: '' }))
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Eliminar diseño
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  Arrastra la imagen del diseño/logo aquí o
                </p>
                <label className="inline-block px-4 py-2 bg-[var(--persian-plum-100)] text-[var(--persian-plum-700)] rounded-lg hover:bg-[var(--persian-plum-200)] cursor-pointer transition-colors">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDisenoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 5MB (Logo o diseño a aplicar en el producto)
                </p>
              </div>
            )}
          </div>

          {/* URL de diseño alternativa */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O ingresa una URL del diseño
            </label>
            <input
              type="url"
              name="disenoUrl"
              value={formData.disenoUrl}
              onChange={(e) => {
                handleChange(e)
                if (e.target.value) {
                  setDisenoPreview(e.target.value)
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
              placeholder="https://ejemplo.com/diseno.png"
            />
          </div>
          
          {/* Preview del diseño y controles - Layout similar a ProductPage */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Previsualizar diseño (así se verá en la página del producto)</h3>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Imagen grande del producto con diseño superpuesto - Lado izquierdo */}
              <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-4">
                <div className="relative w-full" style={{ minHeight: '400px' }}>
                  {/* Imagen base del producto */}
                  <img 
                    src={previewPrenda === 'Buzo' ? buzoFrente : previewPrenda === 'Remera' ? remeraFrente : remeraOver}
                    alt={previewPrenda}
                    className="w-full h-auto object-contain"
                  />
                  
                  {/* Diseño superpuesto */}
                  {(disenoPreview || formData.disenoUrl) && (
                    <img
                      src={disenoPreview || formData.disenoUrl}
                      alt="Diseño"
                      style={{
                        position: 'absolute',
                        top: `${tempPos.top}%`,
                        left: `${tempPos.left}%`,
                        transform: 'translateX(-50%)',
                        width: `${tempSize}px`,
                        height: `${tempSize}px`,
                        objectFit: 'contain',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  )}
                </div>
                
                {/* Indicador de posición actual */}
                <div className="text-center mt-2 text-sm text-gray-600">
                  {previewPrenda} - Posición: {positionPreset} ({tempPos.left}%, {tempPos.top}%)
                </div>
              </div>

              {/* Controles - Lado derecho */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Selector de tipo de prenda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de prenda</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Buzo', 'Remera', 'Remera Oversize'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPreviewPrenda(p)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          previewPrenda === p 
                            ? 'bg-[var(--persian-plum-600)] text-white ring-2 ring-[var(--persian-plum-400)]' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >{p}</button>
                    ))}
                  </div>
                </div>

                {/* Selector de posición predefinida */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posición del diseño</label>
                  <div className="flex gap-2">
                    {[
                      { key: 'izquierda', label: '← Izquierda' },
                      { key: 'centro', label: 'Centro' },
                      { key: 'derecha', label: 'Derecha →' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPositionPreset(key)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          positionPreset === key 
                            ? 'bg-[var(--persian-plum-600)] text-white ring-2 ring-[var(--persian-plum-400)]' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {/* Controles manuales */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium text-gray-800">Ajuste manual</h4>
                  
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>↕ Posición vertical</span>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={tempPos.top}
                        onChange={(e) => setTempPos({ ...tempPos, top: parseInt(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-600)] font-bold"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="60" 
                      value={tempPos.top} 
                      onChange={(e) => {
                        setTempPos({ ...tempPos, top: parseInt(e.target.value) })
                      }} 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--persian-plum-600)]" 
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>↔ Posición horizontal</span>
                      <input
                        type="number"
                        min="10"
                        max="90"
                        value={tempPos.left}
                        onChange={(e) => setTempPos({ ...tempPos, left: parseInt(e.target.value) || 10 })}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-600)] font-bold"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={tempPos.left} 
                      onChange={(e) => {
                        setTempPos({ ...tempPos, left: parseInt(e.target.value) })
                      }} 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--persian-plum-600)]" 
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>📐 Tamaño del diseño</span>
                      <input
                        type="number"
                        min="40"
                        max="300"
                        value={tempSize}
                        onChange={(e) => setTempSize(parseInt(e.target.value) || 40)}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-600)] font-bold"
                      />
                      <span className="text-sm text-gray-500">px</span>
                    </label>
                    <input 
                      type="range" 
                      min="40" 
                      max="300" 
                      value={tempSize} 
                      onChange={(e) => setTempSize(parseInt(e.target.value))} 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--persian-plum-600)]" 
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleSaveDisenoConfig} 
                    className="flex-1 px-4 py-2 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors font-medium"
                  >
                    💾 Guardar configuración
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleResetDisenoConfig(previewPrenda)} 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    ↩ Restablecer
                  </button>
                </div>

                {/* Info */}
                <p className="text-xs text-gray-500">
                  Esta configuración define cómo se verá el diseño en la página del producto. 
                  Los clientes podrán ajustar la posición desde ahí.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancelar}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : producto ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioProducto
