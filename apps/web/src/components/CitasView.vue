<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Gestión de Citas</h2>

      <div class="flex items-center gap-3 flex-1 flex-wrap">
        <div class="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 text-ink-muted">
          <Search class="w-4 h-4 flex-shrink-0" />
          <input v-model="busqueda" type="search" placeholder="Buscar por paciente o motivo…"
            class="bg-transparent border-none outline-none text-sm text-ink w-52 placeholder-ink-muted" />
        </div>
      </div>

      <button @click="abrirModalNuevo"
        class="ml-auto flex items-center gap-2 bg-forest-mid text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-forest transition-colors whitespace-nowrap">
        <Plus class="w-4 h-4" /> Nueva Cita
      </button>
    </header>

    <!-- Content -->
    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="flex justify-between items-start flex-wrap gap-4 mb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-ink">Citas Médicas</h1>
          <p class="text-ink-muted text-sm mt-1">Agenda y seguimiento de citas de pacientes.</p>
        </div>
      </div>

      <!-- Table card -->
      <div class="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div v-if="cargando && citas.length === 0" class="text-center py-12 text-ink-muted text-sm">
          Cargando citas…
        </div>
        <TablaCitas
          v-else
          :citas="citasFiltradas"
          :eliminando-id="eliminandoId"
          @editar="abrirModal"
          @eliminar="confirmarEliminar"
        />
        <div class="flex justify-between items-center px-4 py-3 border-t border-border flex-wrap gap-2">
          <span class="text-xs text-ink-muted">
            Mostrando {{ citasFiltradas.length }} de {{ citas.length }} citas
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
            <CalendarDays class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Total Citas</div>
            <div class="text-2xl font-extrabold text-ink">{{ citas.length }}</div>
          </div>
        </div>

        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Clock class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Programadas</div>
            <div class="text-2xl font-extrabold text-ink">{{ contarPorEstado('Programada') }}</div>
          </div>
        </div>

        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Completadas</div>
            <div class="text-2xl font-extrabold text-ink">{{ contarPorEstado('Completada') }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add / Edit modal -->
    <ModalEditarCita
      v-if="citaSeleccionada"
      :cita="citaSeleccionada"
      :pacientes="pacientes"
      :guardando="guardando"
      :modo="modoModal"
      @guardar="modoModal === 'agregar' ? crearCita($event) : guardarEdicion($event)"
      @cancelar="cerrarModal"
    />

    <!-- Delete confirm -->
    <div v-if="citaAEliminar"
      class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
      @click.self="citaAEliminar = null">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-11/12 shadow-2xl">
        <h3 class="text-base font-bold text-ink mb-3">¿Eliminar cita?</h3>
        <p class="text-sm text-ink-muted mb-6 leading-relaxed">
          ¿Seguro que deseas eliminar la cita de
          <strong class="text-ink">{{ citaAEliminar.pacienteNombre || 'este paciente' }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="citaAEliminar = null"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button @click="eliminarCita" :disabled="eliminandoId !== null"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ eliminandoId !== null ? 'Eliminando…' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, CalendarDays, Clock, CheckCircle2 } from 'lucide-vue-next'
import { citasService } from '../services/citasService.js'
import { pacientesService } from '../services/pacientesService.js'
import TablaCitas from './TablaCitas.vue'
import ModalEditarCita from './ModalEditarCita.vue'
import AlertMessage from './AlertMessage.vue'

const citas = ref([])
const pacientes = ref([])
const cargando = ref(false)
const busqueda = ref('')
const citaSeleccionada = ref(null)
const modoModal = ref('editar')
const guardando = ref(false)
const citaAEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const citasFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return citas.value
  return citas.value.filter((c) =>
    c.pacienteNombre?.toLowerCase().includes(q) || c.motivo?.toLowerCase().includes(q)
  )
})

function contarPorEstado(estado) {
  return citas.value.filter((c) => c.estado === estado).length
}

async function cargarDatos() {
  cargando.value = true
  try {
    const [listaCitas, listaPacientes] = await Promise.all([
      citasService.getAll(),
      pacientesService.getAll(),
    ])
    citas.value = listaCitas
    pacientes.value = listaPacientes
  } catch (err) {
    mostrarAlerta('No se pudo cargar la información. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

function abrirModal(c)     { modoModal.value = 'editar';  citaSeleccionada.value = { ...c } }
function abrirModalNuevo() { modoModal.value = 'agregar'; citaSeleccionada.value = { estado: 'Programada' } }
function cerrarModal()     { citaSeleccionada.value = null }

async function guardarEdicion(datos) {
  guardando.value = true
  try {
    const updated = await citasService.update(datos.id, datos)
    const i = citas.value.findIndex((c) => c.id === datos.id)
    if (i !== -1) citas.value[i] = updated ?? datos
    cerrarModal()
    mostrarAlerta('Cita actualizada correctamente.', 'success')
  } catch (err) {
    mostrarAlerta('Error al guardar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function crearCita(datos) {
  guardando.value = true
  try {
    const nueva = await citasService.create(datos)
    citas.value.push(nueva)
    cerrarModal()
    mostrarAlerta('Cita agendada correctamente.', 'success')
  } catch (err) {
    mostrarAlerta('Error al agendar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(c) { citaAEliminar.value = c }

async function eliminarCita() {
  const c = citaAEliminar.value
  eliminandoId.value = c.id
  citaAEliminar.value = null
  try {
    await citasService.delete(c.id)
    citas.value = citas.value.filter((x) => x.id !== c.id)
    mostrarAlerta('Cita eliminada.', 'success')
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

onMounted(cargarDatos)
</script>
