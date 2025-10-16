import { useRef, useEffect } from 'react'

export const AnimatedSearch = () => {
  const checkboxRef = useRef(null)

  useEffect(() => {
    // Al montar, fuerza el estado cerrado
    const mainbox = checkboxRef.current.nextSibling
    const searchInput = mainbox.querySelector('.search_input')
    const iconContainer = mainbox.querySelector('.iconContainer')
    mainbox.classList.add('w-[50px]')
    mainbox.classList.remove('w-[230px]')
    searchInput.classList.add('w-0', 'h-0')
    searchInput.classList.remove('w-[170px]', 'h-full')
    iconContainer.classList.add('pr-2')
    if (checkboxRef.current) checkboxRef.current.checked = true
  }, [])

  const handleToggle = () => {
    const mainbox = checkboxRef.current.nextSibling
    const searchInput = mainbox.querySelector('.search_input')
    const iconContainer = mainbox.querySelector('.iconContainer')
    if (checkboxRef.current.checked) {
      mainbox.classList.add('w-[50px]')
      mainbox.classList.remove('w-[230px]')
      searchInput.classList.add('w-0', 'h-0')
      searchInput.classList.remove('w-[170px]', 'h-full')
      iconContainer.classList.add('pr-2')
    } else {
      mainbox.classList.add('w-[230px]')
      mainbox.classList.remove('w-[50px]')
      searchInput.classList.add('w-[170px]', 'h-full')
      searchInput.classList.remove('w-0', 'h-0')
      iconContainer.classList.remove('pr-2')
    }
  }

  return (
    <div className="relative w-fit /* posicionamiento */">
      <input
        ref={checkboxRef}
        defaultChecked={true} // permanece cerrado de inicio
        className="
          absolute right-[17px] top-[10px] z-10 /* posicionamiento */
          w-[30px] h-[30px]                      /* modelaje de elemento */
          cursor-pointer appearance-none         /* modelaje de elemento */
          focus:outline-none                     /* miscelanea */
        "
        type="checkbox"
        onChange={handleToggle}
      />
      <div className="
        mainbox w-[230px] h-[50px]              /* modelaje de elemento */
        flex flex-row-reverse items-center justify-center /* modelaje de elemento */
        rounded-full                            /* modelaje de elemento */
        bg-[var(--persian-plum-950)]            /* colores */
        transition-all duration-300 ease-in-out  /* miscelanea */
      ">
        <div className="
          iconContainer transition-all duration-300 ease-in-out /* miscelanea */
        ">
          <svg
            viewBox="0 0 512 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="
              search_icon fill-white text-[1.3em] /* colores, texto */
              box-border                            /* modelaje de elemento */
            "
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
        <input
          className="
            search_input w-[170px] h-full        /* modelaje de elemento */
            bg-transparent border-none outline-none /* colores, miscelanea */
            pb-1 pl-2                           /* posicionamiento */
            text-base text-white                /* texto, colores */
            transition-all duration-300 ease-in-out /* miscelanea */
            font-sans                           /* texto */
          "
          placeholder="buscar diseño"
          type="text"
        />
      </div>
    </div>
  )
}