import { useState, useEffect } from 'react'
import { Navbar } from '../../components'
import { ProductPreview } from '../ProductPreview/ProductPreview'
import { getProductById, getProductConfig } from '../../data/products'
import { Footer } from '../../components'

import buzoFrente from '../../assets/images/buzo_frente.png'
import remeraFrente from '../../assets/images/remera_frente.png'
import logoExample from '../../assets/images/scoty.png'


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

const colores = [
    { name: 'Persian Plum 400', class: 'bg-[var(--persian-plum-400)]' },
    { name: 'Persian Plum 700', class: 'bg-[var(--persian-plum-700)]' },
    { name: 'Persian Plum 200', class: 'bg-[var(--persian-plum-200)]' },
    { name: 'Persian Plum 900', class: 'bg-[var(--persian-plum-900)]' },
    { name: 'Persian Plum 50', class: 'bg-[var(--persian-plum-50)] border border-[var(--persian-plum-400)]' }
]

const talles = ['S', 'M', 'L', 'XL']
const prendas = ['Remera', 'Buzo']
const posicionesLogo = ['Izquierda', 'Centro', 'Derecha']

export const ProductPage = ({ productId = 1 }) => {
    // Obtener el producto desde la data (simulando API call)
    const product = getProductById(productId)
    
    const [selectedPrenda, setSelectedPrenda] = useState('Buzo')
    const [images, setImages] = useState(buzosImages)
    const [selectedImage, setSelectedImage] = useState(buzosImages[0])
    const [selectedColor, setSelectedColor] = useState(colores[0].class)
    const [selectedTalle, setSelectedTalle] = useState(talles[0])
    const [selectedID, setSelectedID] = useState(1)
    const [sideSelected, setSideSelected] = useState('centro')
    
    // Configuración del producto según el tipo de prenda
    const [productConfig, setProductConfig] = useState(null)

    // Hook derivado que determina si el primer botón está seleccionado
    const itsFirstButtonSelected = selectedID === 1

    // URL del logo desde el producto
    const logoUrl = product?.imagen || logoExample

    // Actualiza las imágenes y la imagen seleccionada cuando cambia la prenda
    useEffect(() => {
        if (selectedPrenda === 'Remera') {
            setImages(remerasImages)
            setSelectedImage(remerasImages[0])
            setSelectedID(1)
        } else {
            setImages(buzosImages)
            setSelectedImage(buzosImages[0])
            setSelectedID(1)
        }
        
        // Actualizar la configuración del producto
        if (product) {
            const config = getProductConfig(product.id, selectedPrenda)
            setProductConfig(config)
        }
    }, [selectedPrenda, product])

    const handleImageChange = (image) => {
        setSelectedImage(image)
        setSelectedID(image.id)
    }

    const handlePrendaChange = (prenda) => {
        setSelectedPrenda(prenda)
    }

    return (
        <>
            <Navbar />
            <section className='mt-[15vh] flex gap-10 w-[85vw] mx-auto'>
                <div className='flex flex-col w-[70%] h-[80vh]'>
                    <div className='w-[100%] h-[100%]'>
                        {/* Componente de preview con logo y configuraciones dinámicas */}
                        <ProductPreview 
                            selectedImage={selectedImage}
                            sideSelected={sideSelected}
                            logoUrl={itsFirstButtonSelected ? logoUrl : null}
                            productConfig={productConfig}
                        />

                        <div className='flex w-[100%] h-[25%] gap-4 mt-4'>
                        {images.map((image) => (
                            <button
                            key={image.id}
                            onClick={() => handleImageChange(image)}
                            className={`
                                flex justify-center items-center
                                w-[25%] h-[100%] rounded-xl overflow-hidden cursor-pointer
                                transition-all duration-200
                                ${selectedImage.id === image.id 
                                    ? 'ring-4 ring-[var(--persian-plum-500)] scale-105' 
                                    : 'ring-2 ring-[var(--persian-plum-200)] hover:ring-[var(--persian-plum-400)]'
                                }
                            `}
                            aria-label={`Seleccionar imagen ${image.alt}`}
                            >
                            <img 
                                src={image.url} 
                                alt={image.alt}
                                className='w-[50%] h-auto object-cover'
                            />
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-[30%]'>
                    <div className='flex flex-col justify-start items-start w-[100%]'>
                        <span className='text-3xl text-[var(--persian-plum-900)] font-medium mb-1'>
                            {product?.nombre || 'Example product'}
                        </span>
                        <span className='text-2xl text-[var(--persian-plum-900)] font-medium mb-5'>
                            ${product?.precio || 7000}
                        </span>
                    </div>
                    <div className="flex flex-col w-full h-[60%]">
                        {/* Colores */}
                        <div className="flex flex-col mb-6">
                            <span className="text-xl font-semibold mb-2">Colores</span>
                            <div className="flex gap-4">
                                {(product?.coloresDisponibles || colores).map((color, idx) => (
                                    <button
                                        key={idx}
                                        className={`
                                            w-8 h-8 rounded-full cursor-pointer border-2
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
                        <div className="flex flex-col mb-10">
                            <span className="text-xl font-semibold mb-2">Talle</span>
                            <div className="flex gap-4">
                                {(product?.tallesDisponibles || talles).map((talle) => (
                                    <button
                                        key={talle}
                                        className={`
                                            w-8 h-8 rounded-2xl flex items-center justify-center font-bold p-6 cursor-pointer
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
                        <div className="flex flex-col mb-10">
                            <span className="text-xl font-semibold mb-2">Tipo de prenda</span>
                            <div className="flex gap-4">
                                {prendas.map((prenda) => (
                                <button
                                    key={prenda}
                                    className={`
                                    w-20 h-10 rounded-2xl flex items-center justify-center font-bold cursor-pointer
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
                                <span className="text-xl font-semibold mb-2">Posición del bordado</span>
                                <div className="flex gap-4">
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
                                            onClick={() => setSideSelected(posicion.toLowerCase())}
                                            aria-label={`Posicionar logo a la ${posicion}`}
                                        >
                                            {posicion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className='flex flex-col gap-4'>
                            <button className='w-[100%] rounded-2xl bg-[var(--persian-plum-100)] text-xl font-medium p-3 cursor-pointer hover:bg-[var(--persian-plum-200)] transition-colors'>
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
                        <div className='flex flex-col mt-4.5'>
                            <span className='text-2xl font-medium'>
                                Detalles del producto
                            </span>
                            <p className='text-[16px] mt-2 font-normal'>
                                {product?.descripcion || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus dolore consequuntur iusto libero officiis provident veritatis delectus sit itaque expedita optio, pariatur architecto enim, voluptates distinctio odio quibusdam dolor rerum?'}
                            </p>
                            <span className='text-2xl font-medium mt-2'>
                                Materiales y cuidado
                            </span>
                            <p className='text-[16px] mt-2 font-normal'>
                                100% algodón de alta calidad. Lavar a máquina con agua fría.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </>
    )
}
