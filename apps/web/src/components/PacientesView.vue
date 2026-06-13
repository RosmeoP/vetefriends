<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Gestión de Pacientes</h2>

      <div class="flex items-center gap-3 flex-1 flex-wrap">
        <div class="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 text-ink-muted">
          <Search class="w-4 h-4 flex-shrink-0" />
          <input v-model="busqueda" type="search" placeholder="Buscar paciente…"
            class="bg-transparent border-none outline-none text-sm text-ink w-44 placeholder-ink-muted" />
        </div>

        <nav class="flex gap-1">
          <button v-for="tab in tabs" :key="tab.key"
            @click="tabActiva = tab.key"
            :class="tabActiva === tab.key ? 'bg-forest text-white' : 'text-ink-muted hover:bg-parchment hover:text-ink'"
            class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border-none">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <button @click="abrirModalNuevo"
        class="ml-auto flex items-center gap-2 bg-forest-mid text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-forest transition-colors whitespace-nowrap">
        <Plus class="w-4 h-4" /> Nuevo Paciente
      </button>
    </header>

    <!-- Content -->
    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="flex justify-between items-start flex-wrap gap-4 mb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-ink">Pacientes Caninos</h1>
          <p class="text-ink-muted text-sm mt-1">Administración de registros médicos y estados de visita.</p>
        </div>
        <div class="flex gap-2">
          <button class="flex items-center gap-2 bg-white border border-border rounded-lg px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink-muted transition-colors">
            <Filter class="w-3.5 h-3.5" /> Filtrar
          </button>
          <button class="flex items-center gap-2 bg-white border border-border rounded-lg px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink-muted transition-colors">
            <Download class="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </div>

      <!-- Table card -->
      <div class="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div v-if="cargando && pacientes.length === 0" class="text-center py-12 text-ink-muted text-sm">
          Cargando pacientes…
        </div>
        <TablaPacientes
          v-else
          :pacientes="pacientesFiltrados"
          :eliminando-id="eliminandoId"
          @ver="$emit('ver-detalle', $event)"
          @editar="abrirModal"
          @eliminar="confirmarEliminar"
        />
        <div class="flex justify-between items-center px-4 py-3 border-t border-border flex-wrap gap-2">
          <span class="text-xs text-ink-muted">
            Mostrando {{ pacientesFiltrados.length }} de {{ pacientes.length }} pacientes
          </span>
          <div class="flex gap-2">
            <button class="px-3.5 py-1.5 border border-border rounded-lg text-xs font-semibold text-ink bg-white hover:bg-parchment transition-colors">Anterior</button>
            <button class="px-3.5 py-1.5 border border-forest bg-forest text-white rounded-lg text-xs font-semibold">Siguiente</button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <PawPrint class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs font-semibold text-emerald-600 mb-0.5">+12% vs mes anterior</div>
            <div class="text-xs text-ink-muted mb-1">Total Pacientes</div>
            <div class="text-2xl font-extrabold text-ink">{{ pacientes.length.toLocaleString() }}</div>
          </div>
        </div>

        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Stethoscope class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Ingresos hoy</div>
            <div class="text-2xl font-extrabold text-ink">{{ ingresosHoy }}</div>
          </div>
        </div>

        <div class="bg-white border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 mb-1">
            <Syringe class="w-4 h-4 text-ink-muted" />
            <span class="text-xs text-ink-muted">Capacidad de Cirugía</span>
          </div>
          <div class="text-2xl font-extrabold text-ink mb-3">85%</div>
          <div class="h-2 bg-border rounded-full overflow-hidden">
            <div class="h-full bg-forest-mid rounded-full" style="width: 85%"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add / Edit modal -->
    <ModalEditarPaciente
      v-if="pacienteSeleccionado"
      :paciente="pacienteSeleccionado"
      :propietarios="propietarios"
      :guardando="guardando"
      :modo="modoModal"
      @guardar="modoModal === 'agregar' ? crearPaciente($event) : guardarEdicion($event)"
      @cancelar="cerrarModal"
    />

    <!-- Delete confirm -->
    <div v-if="pacienteAEliminar"
      class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
      @click.self="pacienteAEliminar = null">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-11/12 shadow-2xl">
        <h3 class="text-base font-bold text-ink mb-3">¿Eliminar paciente?</h3>
        <p class="text-sm text-ink-muted mb-6 leading-relaxed">
          ¿Seguro que deseas eliminar a <strong class="text-ink">{{ pacienteAEliminar.nombre }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="pacienteAEliminar = null"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button @click="eliminarPaciente" :disabled="eliminandoId !== null"
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
import { Search, Plus, Filter, Download, Stethoscope, Syringe, PawPrint } from 'lucide-vue-next'
import { pacientesService } from '../services/pacientesService.js'
import { propietariosService } from '../services/propietariosService.js'
import TablaPacientes from './TablaPacientes.vue'
import ModalEditarPaciente from './ModalEditarPaciente.vue'
import AlertMessage from './AlertMessage.vue'

defineEmits(['ver-detalle'])

const tabs = [
  { key: 'all',       label: 'Todos' },
  { key: 'recent',    label: 'Visitas Recientes' },
  { key: 'emergency', label: 'Emergencia' },
]
const tabActiva = ref('all')

const pacientes = ref([])
const propietarios = ref([])
const cargando = ref(false)
const busqueda = ref('')
const pacienteSeleccionado = ref(null)
const modoModal = ref('editar')
const guardando = ref(false)
const pacienteAEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const ingresosHoy = computed(() => Math.min(pacientes.value.length, 24))

const CAPACIDAD_MAX = 10
const capacidadCirugia = computed(() => {
  const activos = pacientes.value.filter((p) => {
    const e = p.estado?.toLowerCase() ?? ''
    return e === 'en cirugía' || e === 'hospitalizado' || e === 'emergencia'
  }).length
  return {
    ocupados: activos,
    porcentaje: Math.min(Math.round((activos / CAPACIDAD_MAX) * 100), 100),
  }
})

const pacientesFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  return pacientes.value.filter((p) => {
    const match = !q || p.nombre?.toLowerCase().includes(q) || p.propietario?.toLowerCase().includes(q)
    if (tabActiva.value === 'emergency') return match && p.estado?.toLowerCase().includes('cirug')
    return match
  })
})

async function cargarPacientes() {
  cargando.value = true
  try {
    const [listaPacientes, listaPropietarios] = await Promise.all([
      pacientesService.getAll(),
      propietariosService.getAll(),
    ])
    pacientes.value = listaPacientes
    propietarios.value = listaPropietarios
  } catch (err) {
    mostrarAlerta('No se pudo cargar la lista. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

function abrirModal(p)     { modoModal.value = 'editar';  pacienteSeleccionado.value = { ...p } }
function abrirModalNuevo() { modoModal.value = 'agregar'; pacienteSeleccionado.value = {} }
function cerrarModal()     { pacienteSeleccionado.value = null }

async function guardarEdicion(datos) {
  guardando.value = true
  try {
    const updated = await pacientesService.update(datos.id, datos)
    const i = pacientes.value.findIndex((p) => p.id === datos.id)
    if (i !== -1) pacientes.value[i] = updated ?? datos
    cerrarModal()
    mostrarAlerta(`"${datos.nombre}" actualizado correctamente.`, 'success')
  } catch (err) {
    mostrarAlerta('Error al guardar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function crearPaciente(datos) {
  guardando.value = true
  try {
    const nuevo = await pacientesService.create(datos)
    pacientes.value.push(nuevo)
    cerrarModal()
    mostrarAlerta(`"${nuevo.nombre}" registrado correctamente.`, 'success')
  } catch (err) {
    mostrarAlerta('Error al registrar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(p) { pacienteAEliminar.value = p }

async function eliminarPaciente() {
  const p = pacienteAEliminar.value
  eliminandoId.value = p.id
  pacienteAEliminar.value = null
  try {
    await pacientesService.delete(p.id)
    pacientes.value = pacientes.value.filter((x) => x.id !== p.id)
    mostrarAlerta(`"${p.nombre}" eliminado.`, 'success')
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

onMounted(cargarPacientes)
</script>
