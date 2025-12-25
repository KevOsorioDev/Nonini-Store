import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ProductPreview } from '../components/ProductPreview/ProductPreview'
import { productosService } from '../services/api'
import { useCart } from '../context/useCart'
import buzoFrente from '../assets/images/buzo_frente.png'
import remeraFrente from '../assets/images/remera_frente.png'
import remeraOver from '../assets/images/remera_over.png'


const buzosImages = [
    { id: 1, url: buzoFrente, alt: 'Producto vista 1' },
    { id: 2, url: 'https://via.placeholder.com/600x800/F4A261/000000?text=Imagen+2', alt: 'Producto vista 2' },
    { id: 3, url: 'https://via.placeholder.com/600x800/E76F51/000000?text=Imagen+3', alt: 'Producto vista 3' },
    { id: 4, url: 'https://via.placeholder.com/600x800/264653/FFFFFF?text=Imagen+4', alt: 'Producto vista 4' }
]

const remerasImages = [
    { id: 1, url: remeraFrente, alt: 'Producto vista 1' },
    { id: 2, url: 'https://via.placeholder.com/600x800/F4A261/000000?text=Imagen+2', alt: 'Producto vista 2' },
    { id: 3, url: 'https://via.placeholder.com/600x800/E76F51/000000?text=Imagen+3', alt: 'Producto vista 3' },
    { id: 4, url: 'https://via.placeholder.com/600x800/264653/FFFFFF?text=Imagen+4', alt: 'Producto vista 4' }
]

const remerasOverImages = [
    { id: 1, url: remeraOver, alt: 'Producto vista 1' },
    { id: 2, url: 'https://via.placeholder.com/600x800/F4A261/000000?text=Imagen+2', alt: 'Producto vista 2' },
    { id: 3, url: 'https://via.placeholder.com/600x800/E76F51/000000?text=Imagen+3', alt: 'Producto vista 3' },
    { id: 4, url: 'https://via.placeholder.com/600x800/264653/FFFFFF?text=Imagen+4', alt: 'Producto vista 4' }
]

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
    const productId = parseInt(id)
    
    // Context del carrito
    const { addToCart } = useCart()
    
    // Estados
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedPrenda, setSelectedPrenda] = useState('Buzo')
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedColor, setSelectedColor] = useState(colores[0].class)
    const [selectedTalle, setSelectedTalle] = useState('S')
    const [selectedID, setSelectedID] = useState(1)
    const [sideSelected, setSideSelected] = useState('centro')
    const [cantidad, setCantidad] = useState(1)
    const [logoPosition, setLogoPosition] = useState({ top: 15, left: 50 })
    const [logoSize, setLogoSize] = useState(120)

    // Cargar producto desde la API
    useEffect(() => {
        const cargarProducto = async () => {
            try {
                setLoading(true)
                const data = await productosService.obtenerPorId(productId)
                setProduct(data)

                // Configurar talle por defecto si hay talles disponibles
                if (data.talles && data.talles.length > 0) {
                    setSelectedTalle(data.talles[0].talle)
                }

                // Lógica de imágenes: la base SIEMPRE es la plantilla de la prenda. El diseño solo se superpone/slide secundario.
                const getBasePlaceholder = () => {
                    if (selectedPrenda === 'Remera') return remeraFrente
                    if (selectedPrenda === 'Remera Oversize') return remeraOver
                    return buzoFrente
                }

                const imgs = []

                // Slide 1: base de la prenda (no usamos disenoUrl ni imagen subida como base)
                imgs.push({ id: 1, url: getBasePlaceholder(), alt: 'Prenda base' })

                // Slide 2: si hay imagen subida distinta del diseño, la mostramos como referencia (sin overlay)
                if (data.imagenUrl && data.imagenUrl !== data.disenoUrl) {
                    imgs.push({ id: imgs.length + 1, url: data.imagenUrl, alt: 'Foto del producto' })
                }

                // Slide extra opcional: diseño/logo como referencia visual
                if (data.disenoUrl) {
                    imgs.push({ id: imgs.length + 1, url: data.disenoUrl, alt: 'Diseño' })
                }

                setImages(imgs)
                setSelectedImage(imgs[0])
                setSelectedID(imgs[0]?.id || 1)

                // Cargar configuración de diseño guardada
                if (data.disenoConfig) {
                    const savedConfig = data.disenoConfig[selectedPrenda]?.[sideSelected] || data.disenoConfig.Buzo?.centro
                    if (savedConfig) {
                        setLogoPosition({ top: savedConfig.top, left: savedConfig.left })
                        setLogoSize(savedConfig.size || 120)
                    }
                }
            } catch (error) {
                console.error('Error al cargar producto:', error)
                toast.error('Error al cargar el producto')
            } finally {
                setLoading(false)
            }
        }

        if (productId) {
            cargarProducto()
        }
    }, [productId, selectedPrenda])
    
    // Sincronizar configuración cuando cambia la prenda o el sideSelected
    useEffect(() => {
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
    
    // Ya no es necesario actualizar imágenes por separado, se maneja en cargarProducto
    
    // Si está cargando
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-900)]"></div>
            </div>
        )
    }
    
    // Si el producto no existe
    if (!product) {
        return <Navigate to="/404" replace />
    }

    // Valores derivados
    const itsFirstButtonSelected = selectedID === 1
    const logoUrl = product.disenoUrl || null
    
    // Configuración del producto para el preview - usar configuración guardada o valores por defecto
    const savedConfig = product.disenoConfig?.[selectedPrenda]?.[sideSelected]
    const defaultConfig = {
      top: sideSelected === 'izquierda' ? 15 : sideSelected === 'derecha' ? 15 : 15,
      left: sideSelected === 'izquierda' ? 25 : sideSelected === 'derecha' ? 75 : 50,
      size: 120
    }
    
    const currentConfig = savedConfig || defaultConfig
    
    // Configuración del producto para el preview
    const productConfig = {
        tamaño: {
            width: `${currentConfig.size}px`,
            height: `${currentConfig.size}px`
        },
        posiciones: {
            izquierda: { top: `${currentConfig.top}%`, left: '25%' },
            centro: { top: `${currentConfig.top}%`, left: `${currentConfig.left}%` },
            derecha: { top: `${currentConfig.top}%`, left: '75%' },
            custom: { top: `${currentConfig.top}%`, left: `${currentConfig.left}%` }
        }
    }

    // Función para actualizar posición predefinida
    const handlePosicionPredefinida = (posicion) => {
        setSideSelected(posicion)
        
        // Usar configuración guardada si existe, sino valores por defecto
        const savedConfig = product?.disenoConfig?.[selectedPrenda]?.[posicion]
        if (savedConfig) {
            setLogoPosition({ top: savedConfig.top, left: savedConfig.left })
            setLogoSize(savedConfig.size || 120)
        } else {
            // Valores por defecto
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

    return (
        <>
            <section className='mt-12 md:mt-20 mb-16 md:mb-24 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-7xl px-4 md:px-8 lg:px-12 mx-auto'>
                <div className='flex flex-col w-full lg:w-2/3'>
                    <div className='w-full'>
                        {/* Componente de preview con logo y configuraciones dinámicas */}
                        <ProductPreview 
                            selectedImage={selectedImage}
                            sideSelected={sideSelected}
                            logoUrl={itsFirstButtonSelected ? logoUrl : null}
                            productConfig={productConfig}
                        />

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
                        
                        {/* Posición del logo bordado - Solo visible si está en la primera vista */}
                        {itsFirstButtonSelected && (
                            <div className="flex flex-col mb-10">
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
                                                min="60"
                                                max="250"
                                                value={logoSize}
                                                onChange={(e) => setLogoSize(parseInt(e.target.value) || 60)}
                                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-[var(--persian-plum-900)] font-bold"
                                            />
                                            <span className="text-sm text-gray-500">px</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="60"
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

                        {/* Botones de acción */}
                        <div className='flex flex-col gap-3 md:gap-4 mb-8'>
                            <button 
                                onClick={() => {
                                    addToCart({
                                        id: product.id,
                                        nombre: product.nombre,
                                        precio: product.precio,
                                        imagen: product.imagen,
                                        prenda: selectedPrenda,
                                        color: selectedColor,
                                        talle: selectedTalle,
                                        cantidad: cantidad
                                    })
                                    
                                    // Notificación personalizada con react-hot-toast
                                    toast.success(
                                        (t) => (
                                            <div className="flex items-start gap-3">
                                                <img 
                                                    src={product.imagen} 
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
                                }}
                                className='w-[100%] rounded-2xl bg-[var(--persian-plum-600)] text-white text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-700)] transition-colors'
                            >
                                Añadir al carrito
                            </button>
                            <button className='w-[100%] rounded-2xl bg-[var(--persian-plum-300)] text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-400)] transition-colors'>
                                Comprar ahora
                            </button>
                            <button className='w-[100%] rounded-2xl bg-[var(--persian-plum-500)] text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-600)] transition-colors'>
                                Personalizar
                            </button>
                        </div>
                        {/* Detalles */}
                        <div className='flex flex-col mt-8 pt-8 border-t-2 border-[var(--persian-plum-200)]'>
                            <span className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>
                                Detalles del producto
                            </span>
                            <p className='text-base md:text-lg mt-2 mb-6 font-normal leading-relaxed'>
                                {product?.descripcion || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus dolore consequuntur iusto libero officiis provident veritatis delectus sit itaque expedita optio, pariatur architecto enim, voluptates distinctio odio quibusdam dolor rerum?'}
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
