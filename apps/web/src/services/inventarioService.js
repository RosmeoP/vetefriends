// CRUD for inventory products → backend /api/inventario.
const BASE_URL = '/api/inventario'

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
  return { id: _id, created_at: createdAt, ...rest } // nombre, categoria, cantidad, precio, descripcion
}

function toApi(p) {
  const { id, created_at, ...rest } = p
  return rest
}

function unwrap(payload) {
  return payload && payload.data !== undefined ? payload.data : payload
}

export const inventarioService = {
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
