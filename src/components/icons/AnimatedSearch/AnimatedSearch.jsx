import { useEffect, useRef } from 'react'

export const AnimatedSearch = ({ open }) => {
  const mainboxRef = useRef(null)
  const searchInputRef = useRef(null)
  const iconContainerRef = useRef(null)

  useEffect(() => {
    const mainbox = mainboxRef.current
    const searchInput = searchInputRef.current
    const iconContainer = iconContainerRef.current

    if (open) {
      mainbox.classList.add('w-[230px]')
      mainbox.classList.remove('w-[50px]')
      searchInput.classList.add('w-[170px]', 'h-full')
      searchInput.classList.remove('w-0', 'h-0')
      iconContainer.classList.remove('pr-2')
    } else {
      mainbox.classList.add('w-[50px]')
      mainbox.classList.remove('w-[230px]')
      searchInput.classList.add('w-0', 'h-0')
      searchInput.classList.remove('w-[170px]', 'h-full')
      iconContainer.classList.add('pr-2')
    }
  }, [open])

  return (
    <div className="relative w-fit">
      <div
        ref={mainboxRef}
        className="
          mainbox w-[50px] h-[50px]
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
              search_icon fill-white text-[1.3em]
              box-border
            "
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          className="
            search_input w-0 h-0
            bg-transparent border-none outline-none
            pb-1 pl-2
            text-base text-white
            transition-all duration-300 ease-in-out
            font-sans
          "
          placeholder="buscar diseño"
          type="text"
        />
      </div>
    </div>
  )
}