export const DPI = 254
export const CM_A_PX = DPI / 2.54
export const ALTO_MAX_CM = 13
export const LARGO_MAX_CM = 18
export const LARGO_MIN_CM = 4
export const PECHO_CM = 58
export const PRENDA_ANCHO_PCT = 75

const redondear = (n, decimales = 1) => {
  const f = 10 ** decimales
  return Math.round(Number(n) * f) / f
}

export const cmAPx = (cm) => redondear(Number(cm) * CM_A_PX, 0)

export const ratioImagen = (anchoPx, altoPx) => {
  const w = Number(anchoPx)
  const h = Number(altoPx)
  if (!w || !h) return 1
  return w / h
}

export const largoMaximo = (anchoPx, altoPx) => {
  const ratio = ratioImagen(anchoPx, altoPx)
  return redondear(Math.min(LARGO_MAX_CM, ALTO_MAX_CM * ratio), 1)
}

export const largoMinimo = (anchoPx, altoPx) => {
  const max = largoMaximo(anchoPx, altoPx)
  return redondear(Math.min(LARGO_MIN_CM, max), 1)
}

export const medidasDesdeLargo = (largoCm, anchoPx, altoPx) => {
  const ratio = ratioImagen(anchoPx, altoPx)
  const max = largoMaximo(anchoPx, altoPx)
  const min = largoMinimo(anchoPx, altoPx)
  const anchoCm = Math.min(max, Math.max(min, Number(largoCm) || min))
  const altoCm = anchoCm / ratio
  return {
    anchoCm: redondear(anchoCm, 1),
    altoCm: redondear(altoCm, 1)
  }
}

export const anchoEnPreviewPct = (anchoCm) =>
  `${((Number(anchoCm) / PECHO_CM) * PRENDA_ANCHO_PCT).toFixed(2)}%`

export const leerMedidasImagen = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve({ w: 1, h: 1 })
      return
    }
    const img = new Image()
    img.onload = () => resolve({
      w: img.naturalWidth || 1,
      h: img.naturalHeight || 1
    })
    img.onerror = () => resolve({ w: 1, h: 1 })
    img.src = src
  })
