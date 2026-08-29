export const formatTelefonoAR = (value) => {
  const bruto = String(value || '')
  if (!bruto.trim()) return ''

  let digits = bruto.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = digits.slice(1)

  if (!digits.startsWith('54')) {
    digits = `54${digits}`
  }

  const rest = digits.slice(2, 14)
  if (!rest) return '+54'

  let mobile9 = false
  let body = rest
  if (body.startsWith('9') && body.length > 1) {
    mobile9 = true
    body = body.slice(1)
  }

  let area = ''
  let local = ''

  if (body.startsWith('11')) {
    area = body.slice(0, 2)
    local = body.slice(2, 10)
  } else if (body.length <= 3) {
    area = body
  } else {
    area = body.slice(0, 3)
    local = body.slice(3, 11)
  }

  let formatted = '+54'
  if (mobile9) formatted += ' 9'
  if (area) formatted += ` ${area}`
  if (local.length > 4) {
    formatted += ` ${local.slice(0, 4)}-${local.slice(4)}`
  } else if (local.length > 0) {
    formatted += ` ${local}`
  }

  return formatted
}

export const telefonoARValido = (value) => (
  /^\+54(?: 9)? \d{2,4} \d{4}-\d{4}$/.test(String(value || '').trim())
)
