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
  productConfig,
  logoPlaceholder = false
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
  const logoAspect = tamaño?.aspectRatio || '1 / 1'

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden">
      <img
        src={selectedImage.url}
        alt={selectedImage.alt}
        className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-auto object-contain"
      />

      {isFirstSlide && posicion && logoUrl && (
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
            aspectRatio: logoAspect,
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />
      )}
      {isFirstSlide && posicion && !logoUrl && logoPlaceholder && (
        <div
          style={{
            position: 'absolute',
            top: posicion.top,
            left: posicion.left,
            transform: 'translateX(-50%)',
            width: logoWidth,
            height: 'auto',
            aspectRatio: logoAspect,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem',
            border: '2px dashed var(--persian-plum-700)',
            background: 'rgba(253, 243, 243, 0.92)',
            color: 'var(--persian-plum-900)',
            fontSize: 'clamp(0.45rem, 1.4vw, 0.7rem)',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.25,
            pointerEvents: 'none'
          }}
        >
          acá va a estar tu diseño
        </div>
      )}
    </div>
  )
}
