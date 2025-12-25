import './WithFunctions.css'
import { useState } from 'react'
import { AnimatedSearch } from '../../icons/AnimatedSearch/AnimatedSearch.jsx'

export const ButtonWithFunctions = ({ children, onClick, text, variant }) => {
  const isSearch = variant === 'search'
  const [open, setOpen] = useState(false)

  const handleClick = (e) => {
    if (isSearch) {
      setOpen((prev) => !prev)
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
        <AnimatedSearch open={open} />
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