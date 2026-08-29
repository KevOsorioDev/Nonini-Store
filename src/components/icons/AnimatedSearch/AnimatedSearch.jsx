import { useEffect, useRef, useState } from 'react'
import './AnimatedSearch.css'

export const AnimatedSearch = ({ open }) => {
  const mainboxRef = useRef(null)
  const searchInputRef = useRef(null)
  const dropdownInputRef = useRef(null)
  const iconContainerRef = useRef(null)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1500)

  // Listener para detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1500)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const mainbox = mainboxRef.current
    const searchInput = searchInputRef.current
    const iconContainer = iconContainerRef.current

    if (open) {
      if (isLargeScreen) {
        mainbox.classList.add('w-[180px]')
        mainbox.classList.remove('w-[40px]', 'w-[50px]', 'sm:w-[50px]', 'w-[200px]', 'sm:w-[230px]')
        searchInput.classList.add('w-[120px]', 'h-full')
        searchInput.classList.remove('w-0', 'h-0', 'w-[140px]', 'sm:w-[170px]')
        iconContainer.classList.remove('pr-2')
      } else {
        mainbox.classList.add('w-[36px]', 'sm:w-[36px]')
        mainbox.classList.remove('w-[40px]', 'w-[50px]', 'sm:w-[50px]')
        searchInput.classList.add('w-0', 'h-0')
        searchInput.classList.remove('w-[140px]', 'w-[170px]', 'sm:w-[170px]', 'h-full', 'w-[120px]')
        iconContainer.classList.add('pr-2')
      }
    } else {
      if (isLargeScreen) {
        mainbox.classList.add('w-[40px]', 'sm:w-[50px]')
        mainbox.classList.remove('w-[200px]', 'w-[230px]', 'sm:w-[230px]', 'w-[180px]')
        searchInput.classList.add('w-0', 'h-0')
        searchInput.classList.remove('w-[140px]', 'w-[170px]', 'sm:w-[170px]', 'h-full', 'w-[120px]')
        iconContainer.classList.add('pr-2')
      } else {
        mainbox.classList.add('w-[36px]', 'sm:w-[36px]')
        mainbox.classList.remove('w-[200px]', 'w-[230px]', 'sm:w-[230px]', 'w-[180px]')
        searchInput.classList.add('w-0', 'h-0')
        searchInput.classList.remove('w-[140px]', 'w-[170px]', 'sm:w-[170px]', 'h-full', 'w-[120px]')
        iconContainer.classList.add('pr-2')
      }
    }
  }, [open, isLargeScreen])

  // Enfocar el input del dropdown cuando se abre en pantallas pequeñas
  useEffect(() => {
    if (open && !isLargeScreen && dropdownInputRef.current) {
      setTimeout(() => {
        dropdownInputRef.current.focus()
      }, 100)
    }
  }, [open, isLargeScreen])

  return (
    <div className="animated-search-container">
      <div
        ref={mainboxRef}
        className="
          mainbox w-[40px] sm:w-[50px] h-[40px] sm:h-[50px]
          flex flex-row-reverse items-center justify-center
          rounded-full
          bg-[var(--persian-plum-950)]
          transition-all duration-300 ease-in-out
        "
      >
        <div
          ref={iconContainerRef}
          className="
            iconContainer transition-all duration-300 ease-in-out
          "
        >
          <svg
            viewBox="0 0 512 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="
              search_icon fill-white text-[1.1em] sm:text-[1.3em]
              box-border
            "
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
        {/* Input inline - solo visible en pantallas >= 1500px */}
        <input
          ref={searchInputRef}
          className="
            search_input w-0 h-0
            bg-transparent border-none outline-none
            pb-1 pl-2
            text-sm sm:text-base text-white
            transition-all duration-300 ease-in-out
            font-sans
          "
          placeholder="buscar diseño"
          type="text"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Dropdown del input - solo visible en pantallas < 1500px */}
      <div 
        className={`
          search-dropdown
          ${open && !isLargeScreen ? 'search-dropdown--open' : 'search-dropdown--closed'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={dropdownInputRef}
          className="search-dropdown__input"
          placeholder="buscar diseño..."
          type="text"
        />
      </div>
    </div>
  )
}