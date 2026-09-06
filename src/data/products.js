export const productsData = []

export const getProductById = (id) => {
  return productsData.find((product) => product.id === Number(id))
}

export const getProductConfig = (productId, tipoPrenda) => {
  const product = getProductById(productId)
  if (!product) return null
  return product.configuraciones?.[tipoPrenda] || null
}

export const toCatalogProduct = (product) => ({
  ...product,
  imagenUrl: product.imagenUrl || product.imagen,
  disenoUrl: product.disenoUrl || product.imagen,
  activo: product.activo !== false
})

export const buscarProductosLocal = (query) => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return productsData
    .filter((product) =>
      product.nombre.toLowerCase().includes(q) ||
      (product.descripcion || '').toLowerCase().includes(q)
    )
    .map(toCatalogProduct)
}
