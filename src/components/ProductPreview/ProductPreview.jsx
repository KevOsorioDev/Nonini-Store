const PREVIEW_BASE_PX = 400

const toBoxPercent = (value) => {
  if (value == null || value === '') return undefined
  const raw = String(value).trim()
  if (raw.endsWith('%')) return raw
  const px = parseFloat(raw)
  if (Number.isNaN(px)) return raw
  return `${(px / PREVIEW_BASE_PX) * 100}%`
}

export const ProductPreview = ({
  selectedImage,
  sideSelected,
  logoUrl,
  productConfig
}) => {
  if (!selectedImage) return null
  const isFirstSlide = selectedImage.id === 1

  if (!productConfig) {
    return (
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-auto object-contain"
        />
      </div>
    )
  }

  const { tamaño, posiciones } = productConfig
  const posicion = posiciones[sideSelected] || posiciones.centro || posiciones.custom
  const logoWidth = toBoxPercent(tamaño?.width)

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden">
      <img
        src={selectedImage.url}
        alt={selectedImage.alt}
        className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-auto object-contain"
      />

      {isFirstSlide && logoUrl && posicion && (
        <img
          src={logoUrl}
          alt="Logo bordado"
          style={{
            position: 'absolute',
            top: posicion.top,
            left: posicion.left,
            transform: 'translateX(-50%)',
            width: logoWidth,
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  )
}
