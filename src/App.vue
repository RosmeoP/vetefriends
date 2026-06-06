<template>
  <div class="flex min-h-screen bg-parchment text-ink font-sans">

    <!-- ── Sidebar ── -->
    <aside class="w-55 min-w-55 bg-forest flex flex-col sticky top-0 h-screen overflow-y-auto">
      <!-- Brand -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-forest-border">
        <span class="text-2xl">🐾</span>
        <div>
          <div class="text-white font-bold text-sm leading-tight">VeteFriends</div>
          <div class="text-sidebar-text text-xs">Clínica Principal</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-3">
        <a href="#" class="nav-item">
          <GridIcon /> Dashboard
        </a>
        <a href="#" class="nav-item nav-item-active">
          <UsersIcon /> Pacientes
        </a>
        <a href="#" class="nav-item">
          <CalendarIcon /> Citas
        </a>
        <a href="#" class="nav-item">
          <FileIcon /> Historial Médico
        </a>
        <a href="#" class="nav-item">
          <ListIcon /> Inventario
        </a>
        <a href="#" class="nav-item">
          <SettingsIcon /> Configuración
        </a>
      </nav>

      <!-- Footer -->
      <div class="py-3 border-t border-forest-border">
        <a href="#" class="nav-item">
          <InfoIcon /> Soporte
        </a>
        <a href="#" class="nav-item">
          <LogOutIcon /> Cerrar sesión
        </a>
      </div>
    </aside>

    <!-- ── Main column ── -->
    <div class="flex-1 min-w-0 flex flex-col">

      <!-- Topbar -->
      <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
        <h2 class="text-sm font-bold text-ink whitespace-nowrap">Gestión de Pacientes</h2>

        <div class="flex items-center gap-3 flex-1 flex-wrap">
          <!-- Search -->
          <div class="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 text-ink-muted">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="busqueda" type="search" placeholder="Buscar paciente…"
              class="bg-transparent border-none outline-none text-sm text-ink w-44 placeholder-ink-muted" />
          </div>

          <!-- Tabs -->
          <nav class="flex gap-1">
            <button v-for="tab in tabs" :key="tab.key"
              @click="tabActiva = tab.key"
              :class="tabActiva === tab.key
                ? 'bg-forest text-white'
                : 'text-ink-muted hover:bg-parchment hover:text-ink'"
              class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border-none">
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Add button -->
        <button class="ml-auto flex items-center gap-2 bg-forest-mid text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-forest transition-colors whitespace-nowrap">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Paciente
        </button>
      </header>

      <!-- Content -->
      <main class="p-6 flex-1">

        <!-- Alert -->
        <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

        <!-- Page heading -->
        <div class="flex justify-between items-start flex-wrap gap-4 mb-5">
          <div>
            <h1 class="text-3xl font-extrabold text-ink">Pacientes Caninos</h1>
            <p class="text-ink-muted text-sm mt-1">Administración de registros médicos y estados de visita.</p>
          </div>
          <div class="flex gap-2">
            <button class="flex items-center gap-2 bg-white border border-border rounded-lg px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink-muted transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filtrar
            </button>
            <button class="flex items-center gap-2 bg-white border border-border rounded-lg px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink-muted transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar
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
            @editar="abrirModal"
            @eliminar="confirmarEliminar"
          />
          <!-- Footer -->
          <div class="flex justify-between items-center px-4 py-3 border-t border-border flex-wrap gap-2">
            <span class="text-xs text-ink-muted">
              Mostrando {{ pacientesFiltrados.length }} de {{ pacientes.length }} pacientes
            </span>
            <div class="flex gap-2">
              <button class="px-3.5 py-1.5 border border-border rounded-lg text-xs font-semibold text-ink bg-white hover:bg-parchment transition-colors">Anterior</button>
              <button class="px-3.5 py-1.5 border border-forest bg-forest text-white rounded-lg text-xs font-semibold transition-colors">Siguiente</button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Total -->
          <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="text-xs font-semibold text-emerald-600 mb-0.5">+12% vs mes anterior</div>
              <div class="text-xs text-ink-muted mb-1">Total Pacientes</div>
              <div class="text-2xl font-extrabold text-ink">{{ pacientes.length.toLocaleString() }}</div>
            </div>
          </div>

          <!-- Ingresos -->
          <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <div class="text-xs text-ink-muted mb-1">Ingresos hoy</div>
              <div class="text-2xl font-extrabold text-ink">{{ ingresosHoy }}</div>
            </div>
          </div>

          <!-- Capacidad -->
          <div class="bg-white border border-border rounded-xl p-5">
            <div class="text-xs text-ink-muted mb-1">Capacidad de Cirugía</div>
            <div class="text-2xl font-extrabold text-ink mb-3">85%</div>
            <div class="h-2 bg-border rounded-full overflow-hidden">
              <div class="h-full bg-forest-mid rounded-full" style="width: 85%"></div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- Edit modal -->
    <ModalEditarPaciente
      v-if="pacienteSeleccionado"
      :paciente="pacienteSeleccionado"
      :guardando="guardando"
      @guardar="guardarEdicion"
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
import { pacientesService } from './services/pacientesService.js'
import TablaPacientes from './components/TablaPacientes.vue'
import ModalEditarPaciente from './components/ModalEditarPaciente.vue'
import AlertMessage from './components/AlertMessage.vue'
import GridIcon from './components/icons/GridIcon.vue'
import UsersIcon from './components/icons/UsersIcon.vue'
import CalendarIcon from './components/icons/CalendarIcon.vue'
import FileIcon from './components/icons/FileIcon.vue'
import ListIcon from './components/icons/ListIcon.vue'
import SettingsIcon from './components/icons/SettingsIcon.vue'
import InfoIcon from './components/icons/InfoIcon.vue'
import LogOutIcon from './components/icons/LogOutIcon.vue'

const tabs = [
  { key: 'all',       label: 'Todos' },
  { key: 'recent',    label: 'Visitas Recientes' },
  { key: 'emergency', label: 'Emergencia' },
]
const tabActiva = ref('all')

const pacientes = ref([])
const cargando = ref(false)
const busqueda = ref('')
const pacienteSeleccionado = ref(null)
const guardando = ref(false)
const pacienteAEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const ingresosHoy = computed(() => Math.min(pacientes.value.length, 24))

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
    pacientes.value = await pacientesService.getAll()
  } catch (err) {
    mostrarAlerta('No se pudo cargar la lista. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

function abrirModal(p)  { pacienteSeleccionado.value = { ...p } }
function cerrarModal()  { pacienteSeleccionado.value = null }

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

<style>
@reference "./assets/tailwind.css";

.nav-item {
  @apply flex items-center gap-2.5 px-4 py-2.5 text-sidebar-text text-sm font-medium
         hover:bg-forest-hover hover:text-green-100 transition-colors no-underline
         cursor-pointer border-none bg-transparent w-full text-left;
}
.nav-item-active {
  @apply bg-forest-mid text-white border-l-[3px] border-gold pl-[calc(1rem-3px)];
}
</style>
