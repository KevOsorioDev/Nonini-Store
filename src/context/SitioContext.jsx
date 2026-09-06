import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { sitioService } from '../services/api'
import { SITIO_DEFAULTS } from '../data/sitioDefaults'

const SitioContext = createContext({
  sitio: SITIO_DEFAULTS,
  cargando: true,
  recargar: async () => {}
})

export const SitioProvider = ({ children }) => {
  const [sitio, setSitio] = useState(SITIO_DEFAULTS)
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    try {
      const data = await sitioService.obtener()
      setSitio({ ...SITIO_DEFAULTS, ...data })
    } catch {
      setSitio(SITIO_DEFAULTS)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  const value = useMemo(
    () => ({ sitio, cargando, recargar }),
    [sitio, cargando, recargar]
  )

  return (
    <SitioContext.Provider value={value}>
      {children}
    </SitioContext.Provider>
  )
}

export const useSitio = () => useContext(SitioContext)
