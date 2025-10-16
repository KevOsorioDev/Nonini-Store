import './App.css'
import { Navbar, DropDownButton, ButtonWithFunctions, Carrousel, Instrucciones, ProductosPopulares } from './components'

import Lenis from 'lenis'

const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

function App() {

  return (
    <>
      <Navbar></Navbar>
      <Carrousel></Carrousel>
      <Instrucciones></Instrucciones>
      <ProductosPopulares></ProductosPopulares>
    </>
  )
}

export default App
