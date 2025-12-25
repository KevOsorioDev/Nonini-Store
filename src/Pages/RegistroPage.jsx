import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/api'
import logo from '../assets/images/nonini_logo.png'

export const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    password: false,
    confirmPassword: false
  })
  
  const navigate = useNavigate()

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  const getFieldError = (field) => {
    if (!touched[field]) return null

    switch (field) {
      case 'nombre': {
        return !formData.nombre.trim() ? 'El nombre es requerido' : null
      }
      case 'email': {
        if (!formData.email.trim()) return 'El email es requerido'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(formData.email) ? 'Email inválido' : null
      }
      case 'password': {
        if (!formData.password) return 'La contraseña es requerida'
        return formData.password.length < 6 ? 'Mínimo 6 caracteres' : null
      }
      case 'confirmPassword': {
        if (!formData.confirmPassword) return 'Confirma tu contraseña'
        return formData.password !== formData.confirmPassword ? 'Las contraseñas no coinciden' : null
      }
      default:
        return null
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones detalladas
    if (!formData.nombre.trim()) {
      toast.error('Por favor ingresa tu nombre')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Por favor ingresa tu correo electrónico')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un correo electrónico válido')
      return
    }

    if (!formData.password) {
      toast.error('Por favor ingresa una contraseña')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!formData.confirmPassword) {
      toast.error('Por favor confirma tu contraseña')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)

    try {
      const response = await authService.registro(formData.nombre, formData.email, formData.password)
      console.log('Registro exitoso:', response)
      toast.success('¡Cuenta creada exitosamente! Redirigiendo...')
      
      // Esperar un momento para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 1500)
    } catch (error) {
      console.error('Error al registrarse:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Error al crear la cuenta'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--persian-plum-50)] to-[var(--persian-plum-100)] px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-2xl">
        {/* Logo */}
        <div className="text-center">
          <img 
            src={logo} 
            alt="Nonini Store" 
            className="mx-auto h-16 sm:h-20 w-auto mb-2"
          />
          <h2 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-bold text-[var(--persian-plum-900)]">
            Crear Cuenta
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-600">
            Únete a Nonini Store y personaliza tus prendas
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-2.5">
                Nombre completo *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                value={formData.nombre}
                onChange={handleChange}
                onBlur={() => handleBlur('nombre')}
                className={`appearance-none relative block w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('nombre') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-[var(--persian-plum-500)] focus:border-transparent'
                }`}
                placeholder="Tu nombre"
              />
              {getFieldError('nombre') && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{getFieldError('nombre')}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-2.5">
                Correo electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`appearance-none relative block w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('email') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-[var(--persian-plum-500)] focus:border-transparent'
                }`}
                placeholder="tu@email.com"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-2.5">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`appearance-none relative block w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    getFieldError('password') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[var(--persian-plum-500)] focus:border-transparent'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>

            {/* Confirmar Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-2.5">
                Confirmar contraseña *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`appearance-none relative block w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    getFieldError('confirmPassword') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[var(--persian-plum-500)] focus:border-transparent'
                  }`}
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
              )}
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 mt-1 text-[var(--persian-plum-600)] focus:ring-[var(--persian-plum-500)] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer">
              Acepto los{' '}
              <a href="#" className="text-[var(--persian-plum-600)] hover:text-[var(--persian-plum-700)] font-medium">
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a href="#" className="text-[var(--persian-plum-600)] hover:text-[var(--persian-plum-700)] font-medium">
                política de privacidad
              </a>
            </label>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-[var(--persian-plum-600)] hover:bg-[var(--persian-plum-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--persian-plum-500)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          {/* Link a Login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-[var(--persian-plum-600)] hover:text-[var(--persian-plum-700)] transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
