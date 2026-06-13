<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10">
      <button @click="$emit('volver')"
        class="flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors">
        <ArrowLeft class="w-4 h-4" /> Volver a Pacientes
      </button>
    </header>

    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div v-if="cargando" class="text-center py-16 text-ink-muted text-sm">Cargando información…</div>

      <div v-else-if="!mascota" class="text-center py-16 text-ink-muted text-sm">
        No se encontró la mascota.
      </div>

      <template v-else>
        <h1 class="text-3xl font-extrabold text-ink mb-1">{{ mascota.nombre }}</h1>
        <p class="text-ink-muted text-sm mb-6">Detalle del paciente e historial clínico.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <!-- Información general de la mascota -->
          <section class="bg-white border border-border rounded-xl p-5">
            <div class="flex items-center gap-2 mb-4">
              <PawPrint class="w-4 h-4 text-forest-mid" />
              <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Información de la mascota</h2>
            </div>
            <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div><dt class="text-ink-muted text-xs">Nombre</dt><dd class="text-ink font-semibold">{{ mascota.nombre || '—' }}</dd></div>
              <div><dt class="text-ink-muted text-xs">Raza</dt><dd class="text-ink font-semibold">{{ mascota.raza || '—' }}</dd></div>
              <div><dt class="text-ink-muted text-xs">Edad</dt><dd class="text-ink font-semibold">{{ mascota.edad != null ? mascota.edad + ' año' + (mascota.edad !== 1 ? 's' : '') : '—' }}</dd></div>
              <div><dt class="text-ink-muted text-xs">Peso</dt><dd class="text-ink font-semibold">{{ mascota.peso ? mascota.peso + ' kg' : '—' }}</dd></div>
              <div><dt class="text-ink-muted text-xs">Estado</dt><dd class="text-ink font-semibold">{{ mascota.estado || '—' }}</dd></div>
              <div class="col-span-2"><dt class="text-ink-muted text-xs">Diagnóstico</dt><dd class="text-ink font-semibold">{{ mascota.diagnostico || '—' }}</dd></div>
            </dl>
          </section>

          <!-- Información completa del propietario -->
          <section class="bg-white border border-border rounded-xl p-5">
            <div class="flex items-center gap-2 mb-4">
              <UserRound class="w-4 h-4 text-forest-mid" />
              <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Propietario</h2>
            </div>
            <dl v-if="propietario" class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div class="col-span-2"><dt class="text-ink-muted text-xs">Nombre completo</dt><dd class="text-ink font-semibold">{{ propietario.nombreCompleto || '—' }}</dd></div>
              <div><dt class="text-ink-muted text-xs">DUI</dt><dd class="text-ink font-semibold">{{ propietario.dui || '—' }}</dd></div>
              <div><dt class="text-ink-muted text-xs">Teléfono</dt><dd class="text-ink font-semibold">{{ propietario.telefono || '—' }}</dd></div>
              <div class="col-span-2"><dt class="text-ink-muted text-xs">Correo</dt><dd class="text-ink font-semibold">{{ propietario.correo || '—' }}</dd></div>
              <div class="col-span-2"><dt class="text-ink-muted text-xs">Dirección</dt><dd class="text-ink font-semibold">{{ propietario.direccion || '—' }}</dd></div>
            </dl>
            <p v-else class="text-sm text-ink-muted">
              {{ mascota.propietario ? mascota.propietario + ' (sin registro de propietario asignado)' : 'Sin propietario asignado.' }}
            </p>
          </section>
        </div>

        <!-- Historial clínico -->
        <section class="bg-white border border-border rounded-xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-border">
            <div class="flex items-center gap-2">
              <ClipboardPlus class="w-4 h-4 text-forest-mid" />
              <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Historial clínico</h2>
              <span class="text-xs text-ink-muted">({{ historiales.length }})</span>
            </div>
            <button @click="abrirModalNuevo"
              class="flex items-center gap-2 bg-forest-mid text-white rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-forest transition-colors">
              <Plus class="w-3.5 h-3.5" /> Agregar consulta
            </button>
          </div>

          <div v-if="cargandoHist" class="text-center py-10 text-ink-muted text-sm">Cargando historial…</div>
          <div v-else-if="historiales.length === 0" class="text-center py-10 text-ink-muted text-sm">
            Sin consultas registradas.
          </div>
          <ul v-else class="divide-y divide-border">
            <li v-for="h in historiales" :key="h.id"
              :class="eliminandoId === h.id ? 'opacity-30 pointer-events-none' : ''"
              class="px-5 py-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span class="text-xs font-bold text-forest-mid bg-forest-mid/10 px-2 py-0.5 rounded">{{ formatDate(h.fecha) }}</span>
                    <span class="font-semibold text-ink text-sm">{{ h.motivo }}</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <p><span class="text-ink-muted text-xs">Diagnóstico: </span><span class="text-ink">{{ h.diagnostico || '—' }}</span></p>
                    <p><span class="text-ink-muted text-xs">Tratamiento: </span><span class="text-ink">{{ h.tratamiento || '—' }}</span></p>
                    <p><span class="text-ink-muted text-xs">Veterinario: </span><span class="text-ink">{{ h.veterinario || '—' }}</span></p>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <button @click="abrirModal(h)" title="Editar"
                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button @click="confirmarEliminar(h)" :disabled="eliminandoId === h.id" title="Eliminar"
                    class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 flex items-center justify-center transition-colors">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </main>

    <!-- Add / Edit consulta modal -->
    <ModalEditarHistorial
      v-if="histSeleccionado"
      :historial="histSeleccionado"
      :guardando="guardando"
      :modo="modoModal"
      @guardar="modoModal === 'agregar' ? crearHistorial($event) : guardarEdicion($event)"
      @cancelar="cerrarModal"
    />

    <!-- Delete confirm -->
    <div v-if="histAEliminar"
      class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
      @click.self="histAEliminar = null">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-11/12 shadow-2xl">
        <h3 class="text-base font-bold text-ink mb-3">¿Eliminar consulta?</h3>
        <p class="text-sm text-ink-muted mb-6 leading-relaxed">
          Se eliminará la consulta del <strong class="text-ink">{{ formatDate(histAEliminar.fecha) }}</strong>.
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="histAEliminar = null"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button @click="eliminarHistorial" :disabled="eliminandoId !== null"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
            {{ eliminandoId !== null ? 'Eliminando…' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, PawPrint, UserRound, ClipboardPlus, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { pacientesService } from '../services/pacientesService.js'
import { propietariosService } from '../services/propietariosService.js'
import { historialesService } from '../services/historialesService.js'
import ModalEditarHistorial from './ModalEditarHistorial.vue'
import AlertMessage from './AlertMessage.vue'

const props = defineProps({
  mascotaId: { type: String, required: true },
})
defineEmits(['volver'])

const mascota = ref(null)
const propietario = ref(null)
const historiales = ref([])
const cargando = ref(false)
const cargandoHist = ref(false)

const histSeleccionado = ref(null)
const modoModal = ref('editar')
const guardando = ref(false)
const histAEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

async function cargar() {
  cargando.value = true
  try {
    mascota.value = await pacientesService.getById(props.mascotaId)
    propietario.value = null
    if (mascota.value?.propietarioId) {
      try {
        propietario.value = await propietariosService.getById(mascota.value.propietarioId)
      } catch { /* owner record may not exist; fall back to name */ }
    }
    await cargarHistoriales()
  } catch (err) {
    mostrarAlerta('No se pudo cargar la información. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

async function cargarHistoriales() {
  cargandoHist.value = true
  try {
    historiales.value = await historialesService.getByMascota(props.mascotaId)
  } catch (err) {
    mostrarAlerta('No se pudo cargar el historial. ' + err.message, 'error')
  } finally {
    cargandoHist.value = false
  }
}

function abrirModal(h)      { modoModal.value = 'editar';  histSeleccionado.value = { ...h } }
function abrirModalNuevo()  { modoModal.value = 'agregar'; histSeleccionado.value = {} }
function cerrarModal()      { histSeleccionado.value = null }

async function crearHistorial(datos) {
  guardando.value = true
  try {
    const nuevo = await historialesService.create({ ...datos, mascotaId: props.mascotaId })
    historiales.value.unshift(nuevo)
    cerrarModal()
    mostrarAlerta('Consulta agregada correctamente.', 'success')
  } catch (err) {
    mostrarAlerta('Error al agregar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function guardarEdicion(datos) {
  guardando.value = true
  try {
    const updated = await historialesService.update(datos.id, { ...datos, mascotaId: props.mascotaId })
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

function confirmarEliminar(h) { histAEliminar.value = h }

async function eliminarHistorial() {
  const h = histAEliminar.value
  eliminandoId.value = h.id
  histAEliminar.value = null
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
