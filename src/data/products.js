import logoScoty from '../assets/images/scoty.png'
import logoMarisol from '../assets/images/marisol-bordado.png'

export const productsData = [
  {
    id: 1,
    nombre: "Logo Scoty",
    descripcion: "Diseño exclusivo de Scoty",
    precio: 7000,
    imagen: logoScoty,
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
  return productsData.find(product => product.id === id)
}

export const getProductConfig = (productId, tipoPrenda) => {
  const product = getProductById(productId)
  if (!product) return null
  return product.configuraciones[tipoPrenda]
}