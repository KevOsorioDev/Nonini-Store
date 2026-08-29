import { useState, useEffect } from 'react'
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ProductPreview } from '../components/ProductPreview/ProductPreview'
import { productosService } from '../services/api'
import { useCart } from '../context/useCart'
import { getProductById, getProductConfig } from '../data/products'
import buzoFrente from '../assets/images/buzo_frente.png'
import remeraFrente from '../assets/images/remera_frente.png'
import remeraOver from '../assets/images/remera_over.png'

const getBasePlaceholder = (prenda) => {
  if (prenda === 'Remera') return remeraFrente
  if (prenda === 'Remera Oversize') return remeraOver
  return buzoFrente
}

const mapLocalProduct = (local) => ({
  id: local.id,
  nombre: local.nombre,
  descripcion: local.descripcion,
  precio: local.precio,
  imagen: local.imagen,
  imagenUrl: local.imagen,
  disenoUrl: local.imagen,
  talles: (local.tallesDisponibles || []).map((talle) => ({ talle })),
  configuraciones: local.configuraciones,
})

const colores = [
    { name: 'Persian Plum 400', class: 'bg-[var(--persian-plum-400)]' },
    { name: 'Persian Plum 700', class: 'bg-[var(--persian-plum-700)]' },
    { name: 'Persian Plum 200', class: 'bg-[var(--persian-plum-200)]' },
    { name: 'Persian Plum 900', class: 'bg-[var(--persian-plum-900)]' },
    { name: 'Persian Plum 50', class: 'bg-[var(--persian-plum-50)] border border-[var(--persian-plum-400)]' }
]

const talles = ['S', 'M', 'L', 'XL']
const prendas = ['Remera', 'Buzo', 'Remera Oversize']
const posicionesLogo = ['Izquierda', 'Centro', 'Derecha']

export const ProductPage = () => {
    // Obtener el ID del producto desde la URL
    const { id } = useParams()
    const productId = parseInt(id, 10)
    const location = useLocation()
    const cartEdit = location.state || null
    const editingItemId = cartEdit?.cartItemId || null
    const prendaDesdeCard = cartEdit?.prenda || null

    const { addToCart, updateCartItem } = useCart()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedPrenda, setSelectedPrenda] = useState(prendaDesdeCard || 'Buzo')
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedColor, setSelectedColor] = useState(cartEdit?.color || colores[0].class)
    const [selectedTalle, setSelectedTalle] = useState(cartEdit?.talle || 'S')
    const [selectedID, setSelectedID] = useState(1)
    const [sideSelected, setSideSelected] = useState(cartEdit?.sideSelected || 'custom')
    const [cantidad, setCantidad] = useState(cartEdit?.cantidad || 1)
    const [logoPosition, setLogoPosition] = useState(cartEdit?.logoPosition || { top: 15, left: 50 })
    const [logoSize, setLogoSize] = useState(cartEdit?.logoSize || 120)

    const aplicarConfigLocal = (local, prenda, lado = 'centro') => {
        const config = getProductConfig(local.id, prenda)
        if (!config) return
        const pos = config.posiciones?.[lado] || config.posiciones?.centro
        if (pos) {
            setLogoPosition({
                top: parseFloat(pos.top),
                left: parseFloat(pos.left)
            })
        }
        if (config.tamaño?.width) {
            setLogoSize(parseInt(config.tamaño.width, 10) || 120)
        }
    }

    useEffect(() => {
        const cargarProducto = async () => {
            const usarProductoLocal = () => {
                const local = getProductById(productId)
                if (!local) return false
                setProduct(mapLocalProduct(local))
                if (local.tallesDisponibles?.length) {
                    setSelectedTalle(local.tallesDisponibles[0])
                }
                const imgs = [{ id: 1, url: getBasePlaceholder(selectedPrenda), alt: 'Prenda base' }]
                setImages(imgs)
                setSelectedImage(imgs[0])
                setSelectedID(1)
                if (!editingItemId) {
                    aplicarConfigLocal(local, selectedPrenda, sideSelected)
                }
                return true
            }

            try {
                setLoading(true)
                const data = await productosService.obtenerPorId(productId)
                setProduct(data)

                if (data.talles && data.talles.length > 0) {
                    setSelectedTalle(data.talles[0].talle)
                }

                const imgs = []
                imgs.push({ id: 1, url: getBasePlaceholder(selectedPrenda), alt: 'Prenda base' })

                if (data.imagenUrl && data.imagenUrl !== data.disenoUrl) {
                    imgs.push({ id: imgs.length + 1, url: data.imagenUrl, alt: 'Foto del producto' })
                }

                if (data.disenoUrl) {
                    imgs.push({ id: imgs.length + 1, url: data.disenoUrl, alt: 'Diseño' })
                }

                setImages(imgs)
                setSelectedImage(imgs[0])
                setSelectedID(imgs[0]?.id || 1)

                if (data.disenoConfig && !editingItemId) {
                    const savedConfig = data.disenoConfig[selectedPrenda]?.[sideSelected] || data.disenoConfig.Buzo?.centro
                    if (savedConfig) {
                        setLogoPosition({ top: savedConfig.top, left: savedConfig.left })
                        setLogoSize(savedConfig.size || 120)
                    }
                }
            } catch {
                if (!usarProductoLocal()) {
                    toast.error('Error al cargar el producto')
                }
            } finally {
                setLoading(false)
            }
        }

        if (Number.isFinite(productId)) {
            cargarProducto()
            return
        }

        if (editingItemId && cartEdit) {
            setProduct({
                id: cartEdit.id,
                nombre: cartEdit.nombre || 'Diseño personalizado',
                precio: cartEdit.precio || 7000,
                imagen: cartEdit.logoUrl,
                disenoUrl: cartEdit.logoUrl,
                imagenUrl: cartEdit.logoUrl
            })
            const imgs = [{
                id: 1,
                url: getBasePlaceholder(selectedPrenda),
                alt: selectedPrenda
            }]
            setImages(imgs)
            setSelectedImage(imgs[0])
            setSelectedID(1)
            setLoading(false)
        }
    }, [productId, selectedPrenda])

    useEffect(() => {
        if (editingItemId) return
        if (prendaDesdeCard) setSelectedPrenda(prendaDesdeCard)
    }, [productId, prendaDesdeCard, editingItemId])

    useEffect(() => {
        if (editingItemId) return
        if (product?.disenoConfig) {
            const savedConfig = product.disenoConfig[selectedPrenda]?.[sideSelected]
            if (savedConfig) {
                setLogoPosition({ top: savedConfig.top, left: savedConfig.left })
                setLogoSize(savedConfig.size || 120)
            } else {
                // Valores por defecto si no hay configuración guardada
                const defaults = {
                    izquierda: { top: 15, left: 25, size: 120 },
                    centro: { top: 15, left: 50, size: 120 },
                    derecha: { top: 15, left: 75, size: 120 },
                    custom: { top: 15, left: 50, size: 120 }
                }
                const defaultConfig = defaults[sideSelected] || defaults.centro
                setLogoPosition({ top: defaultConfig.top, left: defaultConfig.left })
                setLogoSize(defaultConfig.size)
            }
        }
    }, [selectedPrenda, sideSelected, product?.disenoConfig])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-900)]"></div>
            </div>
        )
    }

    if (!product) {
        return <Navigate to="/404" replace />
    }

    // Valores derivados
    const itsFirstButtonSelected = selectedID === 1
    const logoUrl = product.disenoUrl || product.imagen || null

    const productConfig = {
        tamaño: {
            width: `${logoSize}px`,
            height: `${logoSize}px`
        },
        posiciones: {
            izquierda: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` },
            centro: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` },
            derecha: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` },
            custom: { top: `${logoPosition.top}%`, left: `${logoPosition.left}%` }
        }
    }

    // Función para actualizar posición predefinida
    const handlePosicionPredefinida = (posicion) => {
        setSideSelected(posicion)

        const savedConfig = product?.disenoConfig?.[selectedPrenda]?.[posicion]
        const localConfig = getProductConfig(product.id, selectedPrenda)
        const localPos = localConfig?.posiciones?.[posicion]

        if (savedConfig) {
            setLogoPosition({ top: savedConfig.top, left: savedConfig.left })
            setLogoSize(savedConfig.size || 120)
        } else if (localPos) {
            setLogoPosition({
                top: parseFloat(localPos.top),
                left: parseFloat(localPos.left)
            })
            if (localConfig.tamaño?.width) {
                setLogoSize(parseInt(localConfig.tamaño.width, 10) || 120)
            }
        } else {
            const defaults = {
                izquierda: { top: 15, left: 25 },
                centro: { top: 15, left: 50 },
                derecha: { top: 15, left: 75 }
            }
            const defaultPos = defaults[posicion] || defaults.centro
            setLogoPosition({ top: defaultPos.top, left: defaultPos.left })
        }
    }

    const handleImageChange = (image) => {
        setSelectedImage(image)
        setSelectedID(image.id)
    }

    const handlePrendaChange = (prenda) => {
        setSelectedPrenda(prenda)
    }

    const payloadCarrito = () => {
        const prendaImagen = getBasePlaceholder(selectedPrenda)
        const logo = cartEdit?.logoUrl || product.disenoUrl || product.imagen || product.imagenUrl
        return {
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: prendaImagen,
            prendaImagen,
            logoUrl: logo,
            logoPosition: { top: Number(logoPosition.top), left: Number(logoPosition.left) },
            logoSize: Number(logoSize),
            sideSelected,
            prenda: selectedPrenda,
            color: selectedColor,
            talle: selectedTalle,
            cantidad
        }
    }

    const agregarAlCarrito = () => {
        const payload = payloadCarrito()

        if (editingItemId) {
            updateCartItem(editingItemId, payload)
            toast.success('Producto actualizado')
            return
        }

        addToCart(payload)

        toast.success(
            (t) => (
                <div className="flex items-start gap-3">
                    <img
                        src={payload.prendaImagen}
                        alt={product.nombre}
                        className="w-12 h-12 object-contain rounded"
                    />
                    <div className="flex-1">
                        <p className="font-semibold text-[var(--persian-plum-900)]">
                            ¡Agregado al carrito!
                        </p>
                        <p className="text-sm text-gray-600">
                            {cantidad}x {selectedPrenda} - Talle {selectedTalle}
                        </p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
            ),
            {
                duration: 4000,
                style: {
                    maxWidth: '400px',
                }
            }
        )
    }

    return (
        <>
            <section className='mt-12 md:mt-20 mb-16 md:mb-24 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-7xl px-4 md:px-8 lg:px-12 mx-auto'>
                <div className='flex flex-col w-full lg:w-2/3'>
                    <div className='w-full'>
                        <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden">
                          <ProductPreview
                            selectedImage={selectedImage}
                            sideSelected={sideSelected}
                            logoUrl={itsFirstButtonSelected ? logoUrl : null}
                            productConfig={productConfig}
                          />
                        </div>

                        <div className='grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 mt-5 md:mt-6'>
                        {images.map((image) => (
                            <button
                            key={image.id}
                            onClick={() => handleImageChange(image)}
                            className={`
                                flex justify-center items-center
                                rounded-xl overflow-hidden cursor-pointer
                                transition-all duration-200 border
                                ${selectedImage?.id === image.id 
                                    ? 'ring-4 ring-[var(--persian-plum-500)] scale-105 border-transparent' 
                                    : 'ring-2 ring-[var(--persian-plum-200)] hover:ring-[var(--persian-plum-400)] border-gray-200'
                                }
                            `}
                            aria-label={`Seleccionar imagen ${image.alt}`}
                            >
                            <img 
                                src={image.url} 
                                alt={image.alt}
                                className='w-full h-24 object-contain bg-white'
                            />
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full lg:w-1/3 gap-8'>
                    <div className='flex flex-col justify-start items-start w-full'>
                        <span className='text-2xl md:text-3xl lg:text-4xl text-[var(--persian-plum-900)] font-semibold mb-2 md:mb-3'>
                            {product?.nombre || 'Example product'}
                        </span>
                        <span className='text-xl md:text-2xl lg:text-3xl text-[var(--persian-plum-900)] font-medium mb-6 md:mb-8'>
                            ${product?.precio || 7000}
                        </span>
                    </div>
                    <div className="flex flex-col w-full">
                        {/* Colores */}
                        <div className="flex flex-col mb-6 md:mb-8">
                            <span className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Colores</span>
                            <div className="flex gap-3 md:gap-4 flex-wrap">
                                {(product?.coloresDisponibles || colores).map((color, idx) => (
                                    <button
                                        key={idx}
                                        className={`
                                            w-7 h-7 md:w-8 md:h-8 rounded-full cursor-pointer border-2
                                            transition-all duration-200
                                            ${color.class}
                                            ${selectedColor === color.class
                                                ? 'ring-3 ring-[var(--persian-plum-500)] scale-105'
                                                : 'ring-2 ring-transparent hover:ring-[var(--persian-plum-400)]'
                                            }
                                        `}
                                        onClick={() => setSelectedColor(color.class)}
                                        aria-label={`Seleccionar color ${color.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Talles */}
                        <div className="flex flex-col mb-6 md:mb-10">
                            <span className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Talle</span>
                            <div className="flex gap-3 md:gap-4 flex-wrap">
                                {(product?.talles?.map(t => t.talle) || talles).map((talle) => (
                                    <button
                                        key={talle}
                                        className={`
                                            w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold cursor-pointer text-sm md:text-base
                                            bg-[var(--persian-plum-100)] text-[var(--persian-plum-900)]
                                            transition-all duration-200
                                            ${selectedTalle === talle
                                                ? 'ring-3 ring-[var(--persian-plum-500)] scale-105'
                                                : 'ring-2 ring-transparent hover:ring-[var(--persian-plum-400)]'
                                            }
                                        `}
                                        onClick={() => setSelectedTalle(talle)}
                                        aria-label={`Seleccionar talle ${talle}`}
                                    >
                                        {talle}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Tipo de prenda */}
                        <div className="flex flex-col mb-6 md:mb-10">
                            <span className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Tipo de prenda</span>
                            <div className="flex gap-3 md:gap-4 flex-wrap">
                                {prendas.map((prenda) => (
                                <button
                                    key={prenda}
                                    className={`
                                    px-3 py-2 md:px-4 md:py-2 rounded-2xl flex items-center justify-center font-bold cursor-pointer text-xs md:text-sm
                                    bg-[var(--persian-plum-100)] text-[var(--persian-plum-900)]
                                    transition-all duration-200
                                    ${selectedPrenda === prenda
                                        ? 'ring-3 ring-[var(--persian-plum-500)] scale-105'
                                        : 'ring-2 ring-transparent hover:ring-[var(--persian-plum-400)]'
                                    }
                                    `}
                                    onClick={() => handlePrendaChange(prenda)}
                                    aria-label={`Seleccionar prenda ${prenda}`}
                                >
                                    {prenda}
                                </button>
                                ))}
                            </div>
                        </div>
                        
                        {itsFirstButtonSelected && (
                            <div id="personalizar-bordado" className="flex flex-col mb-10">
                                <span className="text-lg md:text-xl font-semibold mb-4 md:mb-5">Posición del bordado</span>
                                
                                {/* Botones de posición predefinida */}
                                <div className="flex gap-3 md:gap-4 mb-6 md:mb-8 flex-wrap">
                                    {posicionesLogo.map((posicion) => (
                                        <button
                                            key={posicion}
                                            className={`
                                                px-4 py-2 rounded-2xl flex items-center justify-center font-bold cursor-pointer text-sm
                                                bg-[var(--persian-plum-100)] text-[var(--persian-plum-900)]
                                                transition-all duration-200
                                                ${sideSelected === posicion.toLowerCase()
                                                    ? 'ring-3 ring-[var(--persian-plum-500)] scale-105'
                                                    : 'ring-2 ring-transparent hover:ring-[var(--persian-plum-400)]'
                                                }
                                            `}
                                            onClick={() => handlePosicionPredefinida(posicion.toLowerCase())}
                                            aria-label={`Posicionar logo a la ${posicion}`}
                                        >
                                            {posicion}
                                        </button>
                                    ))}
                                </div>

                                {/* Controles manuales de posición */}
                                <div className="space-y-5 md:space-y-6 bg-[var(--persian-plum-50)] p-5 md:p-6 rounded-xl">
                                    <div>
                                        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                                            <span>Posición Vertical (Arriba ↔ Abajo)</span>
                                            <input
                                                type="number"
                                                min="5"
                                                max="60"
                                                value={logoPosition.top}
                                                onChange={(e) => {
                                                    setLogoPosition({ ...logoPosition, top: parseInt(e.target.value) || 5 })
                                                    setSideSelected('custom')
                                                }}
                                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-900)] font-bold"
                                            />
                                            <span className="text-sm text-gray-500">%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="60"
                                            value={logoPosition.top}
                                            onChange={(e) => {
                                                setLogoPosition({ ...logoPosition, top: parseInt(e.target.value) })
                                                setSideSelected('custom')
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--persian-plum-600)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                                            <span>Posición Horizontal (Izq ↔ Der)</span>
                                            <input
                                                type="number"
                                                min="10"
                                                max="90"
                                                value={logoPosition.left}
                                                onChange={(e) => {
                                                    setLogoPosition({ ...logoPosition, left: parseInt(e.target.value) || 10 })
                                                    setSideSelected('custom')
                                                }}
                                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-900)] font-bold"
                                            />
                                            <span className="text-sm text-gray-500">%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="90"
                                            value={logoPosition.left}
                                            onChange={(e) => {
                                                setLogoPosition({ ...logoPosition, left: parseInt(e.target.value) })
                                                setSideSelected('custom')
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--persian-plum-600)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                                            <span>Tamaño del diseño</span>
                                            <input
                                                type="number"
                                                min="16"
                                                max="250"
                                                value={logoSize}
                                                onChange={(e) => setLogoSize(parseInt(e.target.value) || 16)}
                                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-900)] font-bold"
                                            />
                                            <span className="text-sm text-gray-500">px</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="16"
                                            max="250"
                                            value={logoSize}
                                            onChange={(e) => setLogoSize(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--persian-plum-600)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Selector de cantidad */}
                        <div className="flex flex-col mb-8">
                            <span className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Cantidad</span>
                            <div className="flex items-center gap-4 md:gap-5">
                                <button
                                    onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--persian-plum-100)] hover:bg-[var(--persian-plum-200)] transition-colors text-xl font-bold"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-semibold w-12 text-center">{cantidad}</span>
                                <button
                                    onClick={() => setCantidad(prev => prev + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--persian-plum-100)] hover:bg-[var(--persian-plum-200)] transition-colors text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 md:gap-4 mb-8'>
                            <button 
                                onClick={() => agregarAlCarrito()}
                                className='w-[100%] rounded-2xl bg-[var(--persian-plum-600)] text-white text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-700)] transition-colors'
                            >
                                {editingItemId ? 'Guardar cambios' : 'Añadir al carrito'}
                            </button>
                            <button
                                onClick={() => {
                                    agregarAlCarrito()
                                    navigate('/checkout')
                                }}
                                className='w-[100%] rounded-2xl bg-[var(--persian-plum-300)] text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-400)] transition-colors'
                            >
                                Comprar ahora
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedID(1)
                                    setSelectedImage(images[0] || selectedImage)
                                    setTimeout(() => {
                                        document.getElementById('personalizar-bordado')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                    }, 50)
                                }}
                                className='w-[100%] rounded-2xl bg-[var(--persian-plum-500)] text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-600)] transition-colors'
                            >
                                Personalizar
                            </button>
                        </div>
                        {/* Detalles */}
                        <div className='flex flex-col mt-8 pt-8 border-t-2 border-[var(--persian-plum-200)]'>
                            <span className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>
                                Detalles del producto
                            </span>
                            <p className='text-base md:text-lg mt-2 mb-6 font-normal leading-relaxed'>
                                {product?.descripcion || 'Sin descripción.'}
                            </p>
                            <span className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>
                                Materiales y cuidado
                            </span>
                            <p className='text-base md:text-lg mt-2 font-normal leading-relaxed'>
                                100% algodón de alta calidad. Lavar a máquina con agua fría.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
