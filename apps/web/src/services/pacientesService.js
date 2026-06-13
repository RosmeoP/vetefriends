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
  // `propietario` is a reference; the API returns it populated (an object)
  const propObj = propietario && typeof propietario === 'object' ? propietario : null
  return {
    id: _id,
    propietarioId: propObj ? propObj._id : (typeof propietario === 'string' ? propietario : ''),
    // Display name: prefer the referenced owner, fall back to legacy free-text `dueño`
    propietario: propObj ? propObj.nombreCompleto : (dueño ?? ''),
    dueño: dueño ?? '',
    created_at: createdAt,
    ...rest, // nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita
  }
}

function toApi(paciente) {
  // Strip UI-only display keys; send the propietario reference (id)
  const { id, propietario, propietarioId, dueño, created_at, ...rest } = paciente
  return {
    ...rest, // nombre, raza, edad, peso, telefono, estado, diagnostico, ultimaVisita
    propietario: propietarioId || null,
    dueño: dueño ?? '',
  }
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
