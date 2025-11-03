import { useState } from 'react'
import './DropDown.css'

export const DropDownButton = ({ dropDownLabel, options = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="dropdown">
      
      <button
        type="button"
        className={`dropdown__button ${menuOpen ? 'dropdown__button--active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="dropdown__label text-2xl">
          {dropDownLabel}
        </span>
        
        <i className={`fa-solid fa-chevron-down dropdown__icon ${menuOpen ? 'dropdown__icon--open' : ''}`} />
      </button>

      <div className={`dropdown__menu flex flex-col justify-center ${menuOpen ? 'dropdown__menu--open' : 'dropdown__menu--closed'}`}>
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            className="dropdown__option"
            onClick={() => {
              option.onClick()
              setMenuOpen(false)
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}