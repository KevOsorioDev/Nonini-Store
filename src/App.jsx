import './App.css'
import { BrowserRouter ,Routes, Route } from "react-router-dom"
import { MainPage, ProductPage } from './components/Pages/indexPages'

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
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage></MainPage>} />
        <Route path='/producto' element={ <ProductPage></ProductPage> } />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
