import { Carrousel, Instrucciones, OpcionesCompra, ProductosPopulares, PorQueElegirnos } from '../components'

export const MainPage = () => {
  return (
    <>
      <Carrousel />
      <Instrucciones />
      <OpcionesCompra />
      <ProductosPopulares />
      <PorQueElegirnos />
      <div className="h-screen" aria-hidden="true" />
    </>
  )
}