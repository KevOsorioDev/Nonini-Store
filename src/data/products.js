import logoScoty from '../assets/images/scoty.png'
import logoMarisol from '../assets/images/marisol-bordado.png'

export const categoriasData = [
  { id: 1, nombre: 'Nike', slug: 'nike' },
  { id: 2, nombre: 'Mascotas', slug: 'mascotas' },
  { id: 3, nombre: 'Disney/Pixar', slug: 'disney-pixar' }
]

export const productsData = [
  {
    id: 1,
    nombre: "Logo Scoty",
    descripcion: "Diseño exclusivo de Scoty",
    precio: 7000,
    imagen: logoScoty,
    categoriaId: 2,
    configuraciones: {
      Remera: {
        tamaño: { width: '80px', height: '80px' },
        posiciones: {
          izquierda: { left: '44%', top: '22%' },
          centro: { left: '50%', top: '22%' },
          derecha: { left: '55%', top: '22%' }
        }
      },
      Buzo: {
        tamaño: { width: '100px', height: '100px' },
        posiciones: {
          izquierda: { left: '46%', top: '25%' },
          centro: { left: '51%', top: '25%' },
          derecha: { left: '56%', top: '25%' }
        }
      }
    },
    tallesDisponibles: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    nombre: "Marisol Bordado",
    descripcion: "Diseño exclusivo Marisol con bordado artesanal",
    precio: 9500,
    imagen: logoMarisol,
    categoriaId: 3,
    configuraciones: {
      Remera: {
        tamaño: { width: '70px', height: '70px' },
        posiciones: {
          izquierda: { left: '44.5%', top: '20%' },
          centro: { left: '49.9%', top: '20%' },
          derecha: { left: '55%', top: '20%' }
        }
      },
      Buzo: {
        tamaño: { width: '80px', height: '105px' },
        posiciones: {
          izquierda: { left: '45%', top: '25%' },
          centro: { left: '50.5%', top: '25%' },
          derecha: { left: '56%', top: '25%' }
        }
      }
    },
    tallesDisponibles: ['S', 'M', 'L', 'XL']
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 3,
    nombre: `Producto ${i + 3}`,
    descripcion: `Próximamente - Diseño exclusivo ${i + 3}`,
    precio: 7500,
    imagen: logoScoty,
    categoriaId: i < 3 ? 1 : i < 6 ? 2 : 3,
    configuraciones: {
      Remera: {
        tamaño: { width: '80px', height: '80px' },
        posiciones: {
          izquierda: { left: '44%', top: '22%' },
          centro: { left: '50%', top: '22%' },
          derecha: { left: '55%', top: '22%' }
        }
      },
      Buzo: {
        tamaño: { width: '100px', height: '100px' },
        posiciones: {
          izquierda: { left: '46%', top: '25%' },
          centro: { left: '51%', top: '25%' },
          derecha: { left: '56%', top: '25%' }
        }
      }
    },
    tallesDisponibles: ['S', 'M', 'L', 'XL']
  }))
]

export const getProductById = (id) => {
  return productsData.find(product => product.id === Number(id))
}

export const getProductConfig = (productId, tipoPrenda) => {
  const product = getProductById(productId)
  if (!product) return null
  return product.configuraciones[tipoPrenda]
}

export const toCatalogProduct = (product) => ({
  ...product,
  imagenUrl: product.imagenUrl || product.imagen,
  disenoUrl: product.disenoUrl || product.imagen,
  activo: product.activo !== false
})

export const buscarProductosLocal = (query) => {
  const q = query.trim().toLowerCase()
  if (!q) return productsData.map(toCatalogProduct)
  return productsData
    .filter((product) =>
      product.nombre.toLowerCase().includes(q) ||
      (product.descripcion || '').toLowerCase().includes(q)
    )
    .map(toCatalogProduct)
}