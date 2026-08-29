import { Link } from 'react-router-dom'
import './DisenoPrendaLinks.css'

const PRENDAS = [
  { id: 'Buzo', label: 'Buzo' },
  { id: 'Remera', label: 'Remera' }
]

export const DisenoPrendaLinks = ({ productId }) => (
  <div
    className="diseno-prenda-links"
    onPointerDown={(event) => event.stopPropagation()}
    onClick={(event) => event.stopPropagation()}
  >
    <span className="diseno-prenda-links__label">Personalizar como</span>
    <div className="diseno-prenda-links__row">
      {PRENDAS.map((prenda) => (
        <Link
          key={prenda.id}
          to={`/producto/${productId}`}
          state={{ prenda: prenda.id }}
        >
          {prenda.label}
        </Link>
      ))}
    </div>
  </div>
)
