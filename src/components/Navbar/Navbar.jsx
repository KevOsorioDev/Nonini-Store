import { DropDownButton, ButtonWithFunctions, useScrollEffect } from '../index';
import logo from '../../assets/images/nonini_logo.png'
import '../../index.css'

export const Navbar = () => {

  const transformed = useScrollEffect();

  return (
    <>
      <header className={`
        ${transformed ? 'top-[1.5%] opacity-100 shadow-lg bg-[var(--persian-plum-50)]' : ''}
        flex fixed top-0 left-1/2 transform -translate-x-1/2 items-center justify-center /* posicionamiento */
        rounded-[50px] /* modelaje de elemento */
        z-[100] /* posicionamiento */
        duration-700 /* miscelanea */
        [transition-property:top,border-radius,width,background-color,padding] /* miscelanea */
        [transition-timing-function:cubic-bezier(.4,1.5,.5,1)] /* miscelanea */
      `}>
        <nav className={`
          flex items-center justify-between gap-[2rem] /* posicionamiento */
          ${transformed ? 'w-[87vw] py-[2vh] px-[2vw]' : 'w-[97vw] py-[2vh] px-[1.2vw]'} /* modelaje de elemento */
          bg-transparent /* colores */
          duration-700 /* miscelanea */
          [transition-property:top,border-radius,width,background-color,padding] /* miscelanea */
          [transition-timing-function:cubic-bezier(.4,1.5,.5,1)] /* miscelanea */
        `}>

          <div className="flex justify-center items-center /* posicionamiento */">
            <img src={logo} alt="Logo" className="w-[3rem] h-[3rem] object-cover /* modelaje de elemento */" />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-x-[1vw] /* posicionamiento */">
            <DropDownButton
              dropDownLabel="Nuestros diseños"
              options={[
                { label: 'Nike', onClick: () => console.log('Modelos de coches') },
                { label: 'Mascotas', onClick: () => console.log('Modelos de motos') },
                { label: 'Disney/Pixar', onClick: () => console.log('Modelos de camiones') }
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
                { label: 'Instagram', onClick: () => console.log('Remeras') },
                { label: 'Facebook', onClick: () => console.log('Buzos') }
              ]}
            />
          </div>

          <div className="flex items-center gap-[1rem] /* posicionamiento */">
            <ButtonWithFunctions
              variant="search"
              onClick={() => console.log('Buscar')}
            >
              {/* <i className="fa-solid fa-magnifying-glass"></i> */}
            </ButtonWithFunctions>

            <ButtonWithFunctions
              text="Carrito"
              onClick={() => console.log('Carrito')}
            >
            </ButtonWithFunctions>
          </div>

        </nav>
      </header>
    </>
  )
}