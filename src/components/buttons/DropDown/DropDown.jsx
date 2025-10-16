import { useState } from 'react';
import '../../../index.css'

export const DropDownButton = ({ dropDownLabel, options = [] }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <button
          type="button"
          className={`group flex items-center gap-2 border-0 bg-transparent cursor-pointer text-[1.4rem] font-semibold transition-colors duration-200 focus:outline-none ${
            menuOpen ? 'text-[var(--persian-plum-400)]' : 'text-[var(--persian-plum-900)]'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-1xl transition-colors duration-200 group-hover:text-[var(--persian-plum-500)]">
            {dropDownLabel}
          </span>
          <i
            className={`fa-solid fa-chevron-down ml-1 pt-[4px] transition-all duration-200 ease-in-out ${
              menuOpen
                ? 'rotate-180 -translate-y-[-1px] scale-[1.1] text-[var(--persian-plum-400)]'
                : 'text-[var(--persian-plum-950)]'
            } group-hover:text-[var(--persian-plum-500)]`}
          ></i>
        </button>

        <div
          className={`absolute left-0 top-[150%] flex flex-col justify-center min-w-[13rem] w-max py-2 px-1 rounded-xl border border-white/10 text-[0.95rem] bg-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.05)] backdrop-blur-[24px] backdrop-saturate-[180%] origin-top-right transition-all duration-200 ease-in-out z-[1000] ${
            menuOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {options.map((option, index) => (
            <button
              type="button"
              key={index}
              className="w-full py-2 px-5 rounded-lg border border-none 
                         text-left text-[1.1rem] font-semibold text-[var(--persian-plum-900)] 
                         bg-transparent 
                         transition-colors duration-200 hover:bg-[var(--persian-plum-50-50)] hover:text-[var(--persian-plum-500)] focus:bg-[var(--persian-plum-100)] focus:text-[var(--persian-plum-500)]"
              onClick={() => {
                option.onClick();
                setMenuOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}