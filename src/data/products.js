// Simulación de data que vendría del backend
// En producción, esto se obtendría de una API
import logoScoty from '../assets/images/scoty.png'
import logoNonini from '../assets/images/nonini_logo.png'

export const productsData = [
  {
    id: 1,
    nombre: "Logo Scotty",
    descripcion: "Diseño exclusivo de Scotty",
    precio: 7000,
    imagen: logoScoty, // Import de Vite
    
    // Configuraciones específicas por tipo de prenda
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
    
    // Colores disponibles para este diseño
    // coloresDisponibles: [
    //   { name: 'Persian Plum 400', class: 'bg-[var(--persian-plum-400)]' },
    //   { name: 'Persian Plum 700', class: 'bg-[var(--persian-plum-700)]' }
    // ],
    
    // Talles disponibles
    tallesDisponibles: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    nombre: "Logo Nonini",
    descripcion: "Diseño del logo de Nonini",
    precio: 8500,
    imagen: logoNonini, // Import de Vite
    
    configuraciones: {
      Remera: {
        tamaño: { width: '90px', height: '90px' },
        posiciones: {
          izquierda: { left: '18%', top: '28%' },
          centro: { left: '50%', top: '28%' },
          derecha: { left: '82%', top: '28%' }
        }
      },
      Buzo: {
        tamaño: { width: '110px', height: '110px' },
        posiciones: {
          izquierda: { left: '22%', top: '32%' },
          centro: { left: '50%', top: '32%' },
          derecha: { left: '78%', top: '32%' }
        }
      }
    },
    
    coloresDisponibles: [
      { name: 'Persian Plum 200', class: 'bg-[var(--persian-plum-200)]' },
      { name: 'Persian Plum 900', class: 'bg-[var(--persian-plum-900)]' }
    ],
    
    tallesDisponibles: ['M', 'L', 'XL']
  }
]

// Función helper para obtener un producto por ID
export const getProductById = (id) => {
  return productsData.find(product => product.id === id)
}

// Función helper para obtener la configuración específica
export const getProductConfig = (productId, tipoPrenda) => {
  const product = getProductById(productId)
  if (!product) return null
  return product.configuraciones[tipoPrenda]
}
