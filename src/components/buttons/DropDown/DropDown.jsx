import { useState, useEffect } from 'react'
import { useInteraction } from '../../../context/InteractionContext'
import './DropDown.css'

export const DropDownButton = ({ dropDownLabel, options = [], dropdownId }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { setActive, clearActive, isActive } = useInteraction()

  const uniqueId = dropdownId || `dropdown-${dropDownLabel?.toLowerCase().replace(/\s+/g, '-')}`

  useEffect(() => {
    if (!isActive(uniqueId) && menuOpen) {
      setMenuOpen(false)
    }
  }, [isActive(uniqueId), menuOpen, uniqueId])

  const handleClick = () => {
    if (menuOpen) {
      setMenuOpen(false)
      clearActive()
    } else {
      setActive(uniqueId)
      setMenuOpen(true)
    }
  }

  const handleOptionClick = (option) => {
    option.onClick()
    setMenuOpen(false)
    clearActive()
  }

  return (
    <div className="dropdown">
      <button
        type="button"
        className={`dropdown__button ${menuOpen ? 'dropdown__button--active' : ''}`}
        onClick={handleClick}
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
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}