import { ProductPreview } from './ProductPreview'

export const CartItemPreview = ({ item, width = 96 }) => {
  const prendaUrl = item.prendaImagen || item.imagen
  const productConfig = {
    tamaño: {
      width: item.logoWidthPct || `${item.logoSize ?? 80}px`,
      height: 'auto',
      aspectRatio: item.logoAnchoCm && item.logoAltoCm
        ? `${item.logoAnchoCm} / ${item.logoAltoCm}`
        : '1 / 1'
    },
    posiciones: {
      custom: {
        top: `${item.logoPosition?.top ?? 22}%`,
        left: `${item.logoPosition?.left ?? 50}%`
      }
    }
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded bg-[var(--persian-plum-50)]"
      style={{ width, aspectRatio: '3 / 4' }}
    >
      <ProductPreview
        selectedImage={{ id: 1, url: prendaUrl, alt: item.prenda || item.nombre }}
        sideSelected="custom"
        logoUrl={item.logoUrl}
        productConfig={productConfig}
      />
    </div>
  )
}
