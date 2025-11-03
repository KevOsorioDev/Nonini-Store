import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DropDownButton, ButtonWithFunctions, useScrollEffect } from '../index'
import { Carrito } from '../Carrito/Carrito'
import logo from '../../assets/images/nonini_logo.png'
import './Navbar.css'

export const Navbar = () => {
  const transformed = useScrollEffect()
  const [carritoOpen, setCarritoOpen] = useState(false)

  return (
    <header className={`navbar ${transformed ? 'navbar--scrolled' : ''} flex items-center justify-center`}>
      
      <nav className="navbar__content">
        
        <div className="navbar__logo">
          <Link to='/'>
            <img src={logo} alt="Logo" className="navbar__logo-img" />
          </Link>
        </div>

        <div className="navbar__center-menu text-2xl">
          <DropDownButton
            dropDownLabel="Nuestros diseños"
            options={[
              { label: 'Nike', onClick: () => console.log('Nike') },
              { label: 'Mascotas', onClick: () => console.log('Mascotas') },
              { label: 'Disney/Pixar', onClick: () => console.log('Disney/Pixar') }
            ]}
          />

          <DropDownButton
            dropDownLabel="Creá tu estilo"
            options={[
              { label: 'Remeras', onClick: () => console.log('Remeras') },
              { label: 'Buzos', onClick: () => console.log('Buzos') }
            ]}
          />

          <DropDownButton
            dropDownLabel="Contactanos"
            options={[
              { label: 'Instagram', onClick: () => console.log('Instagram') },
              { label: 'Facebook', onClick: () => console.log('Facebook') }
            ]}
          />
        </div>

        <div className="navbar__actions">
          <ButtonWithFunctions
            variant="search"
            onClick={() => console.log('Buscar')}
          />

          <ButtonWithFunctions
            text="Carrito"
            onClick={() => setCarritoOpen(true)}
          />
        </div>
      </nav>

      <Carrito 
        isOpen={carritoOpen} 
        onClose={() => setCarritoOpen(false)} 
      />
    </header>
  )
}