import './HamburgerMenu.css'

export const HamburgerButton = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`hamburger-btn ${isOpen ? 'hamburger-btn--active' : ''}`}
      onClick={onToggle}
      aria-label="Menú"
      aria-expanded={isOpen}
    >
      <span className="hamburger-btn__line"></span>
      <span className="hamburger-btn__line"></span>
      <span className="hamburger-btn__line"></span>
    </button>
  )
}