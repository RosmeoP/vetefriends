// CRUD for owners (propietarios) → backend /api/propietarios.
const BASE_URL = '/api/propietarios'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }
  if (res.status === 204) return null
  return res.json()
}

function fromApi(p) {
  if (!p) return p
  const { _id, createdAt, ...rest } = p
  return { id: _id, created_at: createdAt, ...rest } // nombreCompleto, dui, telefono, correo, direccion
}

function toApi(p) {
  const { id, created_at, ...rest } = p
  return rest
}

function unwrap(payload) {
  return payload && payload.data !== undefined ? payload.data : payload
}

export const propietariosService = {
  async getAll() {
    const res = await fetch(BASE_URL)
    const data = await handleResponse(res)
    return Array.isArray(data) ? data.map(fromApi) : []
  },
  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`)
    return fromApi(await handleResponse(res))
  },
  async create(data) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApi(data)),
    })
    return fromApi(unwrap(await handleResponse(res)))
  },
  async update(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApi(data)),
    })
    return fromApi(unwrap(await handleResponse(res)))
  },
  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },
}
