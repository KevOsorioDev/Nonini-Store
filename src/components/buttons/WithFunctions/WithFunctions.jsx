import '../../../index.css'
import { AnimatedSearch } from '../../icons/animatedSearch/AnimatedSearch.jsx'

export const ButtonWithFunctions = ({ children, onClick, text, variant }) => {
  const isSearch = variant === 'search';

  return (
    <button
      type="button"
      className={
        [
          // posicionamiento
          'group flex flex-col items-center justify-center gap-1',
          // modelaje de elemento
          isSearch ? 'bg-transparent' : 'bg-[var(--persian-plum-950)]',
          'px-3 py-2.5 rounded-3xl border-0 cursor-pointer',
          // texto
          isSearch ? '' : 'text-white',
          // colores
          isSearch
            ? ''
            : 'hover:bg-[var(--persian-plum-700)] hover:text-[var(--persian-plum-50)] active:bg-[var(--persian-plum-400)] active:text-[var(--persian-plum-950)]',
          // miscelanea
          'transition-colors duration-200 ease-in-out focus:outline-none'
        ].join(' ')
      }
      onClick={onClick}
    >
      {isSearch ? <AnimatedSearch /> : (
        children && (
          <span className={
            [
              // texto
              'text-xl transition-colors duration-200 ease-in-out',
              isSearch
                ? 'text-[var(--persian-plum-900)]'
                : 'group-hover:text-[var(--persian-plum-50)] group-active:text-[var(--persian-plum-950)]'
            ].join(' ')
          }>
            {children}
          </span>
        )
      )}
      {text && (
        <span className="text-base font-semibold transition-colors duration-200 ease-in-out group-hover:text-[var(--persian-plum-50)] group-active:text-[var(--persian-plum-950)]">
          {text}
        </span>
      )}
    </button>
  )
}