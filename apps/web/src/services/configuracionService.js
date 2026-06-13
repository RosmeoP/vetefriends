// Clinic profile (singleton) → backend /api/configuracion.
const BASE_URL = '/api/configuracion'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

function fromApi(c) {
  if (!c) return c
  const { _id, createdAt, updatedAt, ...rest } = c
  return { id: _id, ...rest } // nombreClinica, direccion, telefono, correo, horario
}

function unwrap(payload) {
  return payload && payload.data !== undefined ? payload.data : payload
}

export const configuracionService = {
  async get() {
    const res = await fetch(BASE_URL)
    return fromApi(await handleResponse(res))
  },
  async update(data) {
    const { id, ...rest } = data
    const res = await fetch(BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    })
    return fromApi(unwrap(await handleResponse(res)))
  },
}
