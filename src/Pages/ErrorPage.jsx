import { Link } from 'react-router-dom'

export const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--persian-plum-50)] to-[var(--persian-plum-100)] px-4 py-8">
      <div className="text-center max-w-2xl">
        {/* Número de error grande */}
        <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-bold text-[var(--persian-plum-400)] leading-none mb-3 sm:mb-4 animate-pulse">
          404
        </h1>

        {/* Mensaje principal */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--persian-plum-900)] mb-4 sm:mb-6 px-4">
          ¡Ups! Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="text-base sm:text-lg md:text-xl text-[var(--persian-plum-700)] mb-6 sm:mb-8 max-w-md mx-auto px-4">
          Parece que la página que buscás no existe o fue movida a otro lugar.
        </p>

        {/* Ilustración decorativa con CSS */}
        <div className="flex justify-center gap-2 mb-8 sm:mb-10">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[var(--persian-plum-400)] animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[var(--persian-plum-500)] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[var(--persian-plum-600)] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
          <Link
            to="/"
            className="px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base bg-[var(--persian-plum-600)] text-white font-medium rounded-lg hover:bg-[var(--persian-plum-700)] shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center"
          >
            Volver al inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base bg-white text-[var(--persian-plum-700)] font-medium rounded-lg border-2 border-[var(--persian-plum-300)] hover:bg-[var(--persian-plum-50)] transition-colors"
          >
            Volver atrás
          </button>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--persian-plum-300)] px-4">
          <p className="text-xs sm:text-sm text-[var(--persian-plum-600)] mb-3 sm:mb-4">
            ¿Necesitás ayuda? Visitá estas páginas:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <Link
              to="/"
              className="text-[var(--persian-plum-700)] hover:text-[var(--persian-plum-900)] hover:underline transition-colors"
            >
              Inicio
            </Link>
            <span className="text-[var(--persian-plum-400)]">•</span>
            <Link
              to="/producto"
              className="text-[var(--persian-plum-700)] hover:text-[var(--persian-plum-900)] hover:underline transition-colors"
            >
              Productos
            </Link>
            <span className="text-[var(--persian-plum-400)]">•</span>
            <a
              href="mailto:contacto@nonini@gmail.com"
              className="text-[var(--persian-plum-700)] hover:text-[var(--persian-plum-900)] hover:underline transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
