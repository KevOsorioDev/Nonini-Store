import { Carrousel, Instrucciones, OpcionesCompra, ProductosPopulares, PorQueElegirnos } from '../components'
import { useStackCover } from '../hooks/useStackCover'
import '../components/HomeStack.css'

export const MainPage = () => {
  useStackCover()

  return (
    <>
      <Carrousel />
      <Instrucciones />
      <div className="home-stack">
        <OpcionesCompra />
        <ProductosPopulares />
        <PorQueElegirnos />
      </div>
    </>
  )
}
