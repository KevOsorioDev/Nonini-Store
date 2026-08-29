import './WithFunctions.css'
import { useState, useEffect } from 'react'
import { useInteraction } from '../../../context/InteractionContext'

export const ButtonWithFunctions = ({ children, onClick, text, variant }) => {
  const isSearch = variant === 'search'
  const [open, setOpen] = useState(false)
  const { setActive, clearActive, isActive } = useInteraction()

  const searchId = 'search-input'

  useEffect(() => {
    if (!isActive(searchId) && open) {
      setOpen(false)
    }
  }, [isActive, open, searchId])

  const handleClick = (e) => {
    if (isSearch) {
      if (open) {
        setOpen(false)
        clearActive()
      } else {
        setActive(searchId)
        setOpen(true)
      }
    }
    if (onClick) onClick(e)
  }

  return (
    <button
      type="button"
      className={`btn ${isSearch ? 'btn--search' : 'btn--primary text-xl'}`}
      onClick={handleClick}
    >
      {isSearch ? (
        <i className="fa-solid fa-magnifying-glass text-[1.45rem]"></i>
      ) : (
        children && (
          <span className="btn__icon">
            {children}
          </span>
        )
      )}
      {text && (
        <span className="btn__text">
          {text}
        </span>
      )}
    </button>
  )
}