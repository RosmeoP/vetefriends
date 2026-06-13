// Clinical history (historiales clínicos) → backend /api/historiales.
const BASE_URL = '/api/historiales'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }
  if (res.status === 204) return null
  return res.json()
}

function fromApi(h) {
  if (!h) return h
  const { _id, fechaConsulta, mascota, createdAt, ...rest } = h
  return {
    id: _id,
    // `<input type="date">` needs YYYY-MM-DD
    fecha: fechaConsulta ? String(fechaConsulta).slice(0, 10) : '',
    mascotaId: mascota && typeof mascota === 'object' ? mascota._id : mascota ?? '',
    created_at: createdAt,
    ...rest, // motivo, diagnostico, tratamiento, veterinario
  }
}

function toApi(h) {
  const { id, fecha, mascotaId, created_at, ...rest } = h
  return { ...rest, fechaConsulta: fecha, mascota: mascotaId } // motivo, diagnostico, tratamiento, veterinario
}

function unwrap(payload) {
  return payload && payload.data !== undefined ? payload.data : payload
}

export const historialesService = {
  async getByMascota(mascotaId) {
    const res = await fetch(`${BASE_URL}/mascota/${mascotaId}`)
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
