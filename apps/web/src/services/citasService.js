// Talks to the backend (apps/api) Express API for appointments (citas).
// In dev, Vite proxies `/api` → http://localhost:3001 (see vite.config.js).
const BASE_URL = '/api/citas'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// ── Adapters between the API "cita" and the UI shape ──
// The API stores `paciente` as a reference and returns it populated (an object).
// The UI works with `pacienteId` (for the <select>) + `pacienteNombre` (for display).

function fromApi(cita) {
  if (!cita) return cita
  const { _id, paciente, fecha, createdAt, ...rest } = cita
  const pacienteObj = paciente && typeof paciente === 'object' ? paciente : null
  return {
    id: _id,
    pacienteId: pacienteObj ? pacienteObj._id : paciente ?? '',
    pacienteNombre: pacienteObj ? pacienteObj.nombre : '',
    // `<input type="date">` needs YYYY-MM-DD
    fecha: fecha ? String(fecha).slice(0, 10) : '',
    created_at: createdAt,
    ...rest, // hora, motivo, veterinario, estado
  }
}

function toApi(cita) {
  const { id, pacienteId, pacienteNombre, created_at, ...rest } = cita
  return { ...rest, paciente: pacienteId } // hora, motivo, veterinario, estado, fecha
}

// create/update respond with { message, data }; read returns the doc directly
function unwrap(payload) {
  return payload && payload.data !== undefined ? payload.data : payload
}

export const citasService = {
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
