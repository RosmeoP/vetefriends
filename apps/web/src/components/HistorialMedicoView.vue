<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Historial Médico</h2>

      <div class="flex items-center gap-3 flex-1 flex-wrap">
        <div class="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 text-ink-muted">
          <Search class="w-4 h-4 flex-shrink-0" />
          <input v-model="busqueda" type="search" placeholder="Buscar por mascota, motivo o veterinario…"
            class="bg-transparent border-none outline-none text-sm text-ink w-64 placeholder-ink-muted" />
        </div>
      </div>

      <button @click="abrirModalNuevo" :disabled="mascotas.length === 0"
        class="ml-auto flex items-center gap-2 bg-forest-mid text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
        <Plus class="w-4 h-4" /> Nueva Consulta
      </button>
    </header>

    <!-- Content -->
    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="flex justify-between items-start flex-wrap gap-4 mb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-ink">Historial Médico</h1>
          <p class="text-ink-muted text-sm mt-1">Todas las consultas clínicas registradas.</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div v-if="cargando && historiales.length === 0" class="text-center py-12 text-ink-muted text-sm">
          Cargando historial…
        </div>
        <TablaHistoriales
          v-else
          :historiales="historialesFiltrados"
          :eliminando-id="eliminandoId"
          @editar="abrirModal"
          @eliminar="confirmarEliminar"
        />
        <div class="flex justify-between items-center px-4 py-3 border-t border-border flex-wrap gap-2">
          <span class="text-xs text-ink-muted">
            Mostrando {{ historialesFiltrados.length }} de {{ historiales.length }} consultas
          </span>
        </div>
      </div>
    </main>

    <!-- Add / Edit modal -->
    <ModalEditarHistorial
      v-if="histSeleccionado"
      :historial="histSeleccionado"
      :mascotas="mascotas"
      :pedir-mascota="true"
      :guardando="guardando"
      :modo="modoModal"
      @guardar="modoModal === 'agregar' ? crear($event) : guardarEdicion($event)"
      @cancelar="cerrarModal"
    />

    <!-- Delete confirm -->
    <div v-if="aEliminar"
      class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
      @click.self="aEliminar = null">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-11/12 shadow-2xl">
        <h3 class="text-base font-bold text-ink mb-3">¿Eliminar consulta?</h3>
        <p class="text-sm text-ink-muted mb-6 leading-relaxed">
          Se eliminará la consulta de <strong class="text-ink">{{ aEliminar.mascotaNombre || 'esta mascota' }}</strong>
          del {{ formatDate(aEliminar.fecha) }}. Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="aEliminar = null"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button @click="eliminar" :disabled="eliminandoId !== null"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
            {{ eliminandoId !== null ? 'Eliminando…' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Plus } from 'lucide-vue-next'
import { historialesService } from '../services/historialesService.js'
import { pacientesService } from '../services/pacientesService.js'
import TablaHistoriales from './TablaHistoriales.vue'
import ModalEditarHistorial from './ModalEditarHistorial.vue'
import AlertMessage from './AlertMessage.vue'

const historiales = ref([])
const mascotas = ref([])
const cargando = ref(false)
const busqueda = ref('')
const histSeleccionado = ref(null)
const modoModal = ref('editar')
const guardando = ref(false)
const aEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const historialesFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return historiales.value
  return historiales.value.filter((h) =>
    h.mascotaNombre?.toLowerCase().includes(q) ||
    h.motivo?.toLowerCase().includes(q) ||
    h.veterinario?.toLowerCase().includes(q)
  )
})

// Pets are stored on each record by id; this keeps the table name in sync after edits
function nombreMascota(mascotaId) {
  return mascotas.value.find((m) => m.id === mascotaId)?.nombre ?? ''
}

async function cargar() {
  cargando.value = true
  try {
    const [listaHist, listaMascotas] = await Promise.all([
      historialesService.getAll(),
      pacientesService.getAll(),
    ])
    mascotas.value = listaMascotas
    historiales.value = listaHist
  } catch (err) {
    mostrarAlerta('No se pudo cargar el historial. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

function abrirModal(h)     { modoModal.value = 'editar';  histSeleccionado.value = { ...h } }
function abrirModalNuevo() { modoModal.value = 'agregar'; histSeleccionado.value = {} }
function cerrarModal()     { histSeleccionado.value = null }

async function crear(datos) {
  guardando.value = true
  try {
    const nuevo = await historialesService.create(datos)
    nuevo.mascotaNombre = nuevo.mascotaNombre || nombreMascota(nuevo.mascotaId)
    historiales.value.unshift(nuevo)
    cerrarModal()
    mostrarAlerta('Consulta registrada correctamente.', 'success')
  } catch (err) {
    mostrarAlerta('Error al registrar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function guardarEdicion(datos) {
  guardando.value = true
  try {
    const updated = await historialesService.update(datos.id, datos)
    if (updated) updated.mascotaNombre = updated.mascotaNombre || nombreMascota(updated.mascotaId)
    const i = historiales.value.findIndex((h) => h.id === datos.id)
    if (i !== -1) historiales.value[i] = updated ?? datos
    cerrarModal()
    mostrarAlerta('Consulta actualizada correctamente.', 'success')
  } catch (err) {
    mostrarAlerta('Error al guardar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(h) { aEliminar.value = h }

async function eliminar() {
  const h = aEliminar.value
  eliminandoId.value = h.id
  aEliminar.value = null
  try {
    await historialesService.delete(h.id)
    historiales.value = historiales.value.filter((x) => x.id !== h.id)
    mostrarAlerta('Consulta eliminada.', 'success')
  } catch (err) {
    mostrarAlerta('Error al eliminar: ' + err.message, 'error')
  } finally {
    eliminandoId.value = null
  }
}

function mostrarAlerta(mensaje, tipo = 'success') {
  clearTimeout(alertaTimer)
  alerta.value = { mensaje, tipo }
  alertaTimer = setTimeout(cerrarAlerta, 5000)
}
function cerrarAlerta() { alerta.value = { mensaje: '', tipo: 'success' } }

function formatDate(val) {
  if (!val) return '—'
  const [y, m, d] = String(val).split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, d || 1)
  return isNaN(date) ? val : date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(cargar)
</script>
