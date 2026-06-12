// Talks to the backend (apps/api) Express API.
// In dev, Vite proxies `/api` → http://localhost:3001 (see vite.config.js).
const BASE_URL = '/api/perros'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// ── Adapters: the API stores a "perro", the UI works with a "paciente" ──
// Differences: _id↔id, the owner name lives in `dueño` on the API side,
// and create/update wrap the document in { message, data }.

function fromApi(perro) {
  if (!perro) return perro
  const { _id, dueño, propietario, createdAt, ...rest } = perro
  return {
    id: _id,
    // Owner name comes from `dueño`; fall back to `propietario` only if it's a plain string
    propietario: dueño ?? (typeof propietario === 'string' ? propietario : ''),
    created_at: createdAt,
    ...rest, // nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita
  }
}

function toApi(paciente) {
  // Strip UI-only keys; the owner name maps back to `dueño`
  const { id, propietario, created_at, ...rest } = paciente
  return { ...rest, dueño: propietario }
}

// create/update respond with { message, data }; read returns the doc directly
function unwrap(payload) {
  return payload && payload.data !== undefined ? payload.data : payload
}

export const pacientesService = {
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
