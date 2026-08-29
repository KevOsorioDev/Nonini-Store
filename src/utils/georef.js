const BASE = 'https://apis.datos.gob.ar/georef/api'

const getJson = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      url.searchParams.set(key, String(value).trim())
    }
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('No se pudo consultar la dirección')
  }
  return response.json()
}

export const esCABA = (provincia) => (
  /ciudad aut[oó]noma de buenos aires|caba/i.test(String(provincia || ''))
)

export const obtenerProvincias = async () => {
  const data = await getJson('/provincias', {
    campos: 'id,nombre',
    max: 30,
    orden: 'nombre'
  })
  return data.provincias || []
}

export const buscarLocalidades = async (nombre, provincia) => {
  if (!nombre || String(nombre).trim().length < 2) return []
  const data = await getJson('/localidades', {
    nombre: nombre.trim(),
    provincia,
    max: 8,
    campos: 'id,nombre',
    orden: 'nombre'
  })
  return data.localidades || []
}

export const validarDireccion = async ({ direccion, ciudad, provincia }) => {
  const params = {
    direccion,
    max: 5
  }
  if (provincia) params.provincia = provincia
  if (ciudad && !esCABA(provincia)) params.localidad = ciudad

  const data = await getJson('/direcciones', params)
  const match = data.direcciones?.[0]
  if (!match) return null

  return {
    nomenclatura: match.nomenclatura,
    calle: match.calle?.nombre || '',
    altura: match.altura?.valor || '',
    ciudad: match.localidad_censal?.nombre || ciudad,
    provincia: match.provincia?.nombre || provincia,
    lat: match.ubicacion?.lat,
    lon: match.ubicacion?.lon
  }
}
