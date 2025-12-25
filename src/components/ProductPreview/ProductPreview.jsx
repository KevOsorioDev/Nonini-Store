// Componente que renderiza la imagen del producto con el logo bordado
export const ProductPreview = ({ selectedImage, sideSelected, logoUrl, productConfig }) => {
  if (!selectedImage) return null
  const isFirstSlide = selectedImage.id === 1

  // Si no hay configuración, usar valores por defecto
  if (!productConfig) {
    return (
      <div className="relative w-[100%] h-[75%] rounded-2xl overflow-hidden">
        <img 
          src={selectedImage.url} 
          alt={selectedImage.alt}
          className="absolute left-[50%] -translate-x-1/2 w-[50%] h-auto object-cover"
        />
      </div>
    )
  }

  const { tamaño, posiciones } = productConfig
  const posicion = posiciones[sideSelected] || posiciones.centro

  return (
    <div className="relative w-full aspect-[3/4] max-w-3xl mx-auto rounded-2xl overflow-hidden h-[60%] ">
      {/* Imagen principal del producto */}
      <img 
        src={selectedImage.url} 
        alt={selectedImage.alt}
        className="absolute left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-auto object-contain"
      />
      
      {/* Logo bordado - solo visible en la primera diapositiva */}
      {isFirstSlide && logoUrl && (
        <img
          src={logoUrl}
          alt="Logo bordado"
          style={{
            position: 'absolute',
            top: posicion.top,
            left: posicion.left,
            transform: 'translateX(-50%)',
            width: tamaño.width,
            height: tamaño.height,
            transition: 'left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease',
            objectFit: 'contain'
          }}
        />
      )}
    </div>
  )
}
