<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Gestión de Propietarios</h2>

      <div class="flex items-center gap-3 flex-1 flex-wrap">
        <div class="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 text-ink-muted">
          <Search class="w-4 h-4 flex-shrink-0" />
          <input v-model="busqueda" type="search" placeholder="Buscar por nombre o DUI…"
            class="bg-transparent border-none outline-none text-sm text-ink w-52 placeholder-ink-muted" />
        </div>
      </div>

      <button @click="abrirModalNuevo"
        class="ml-auto flex items-center gap-2 bg-forest-mid text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-forest transition-colors whitespace-nowrap">
        <Plus class="w-4 h-4" /> Nuevo Propietario
      </button>
    </header>

    <!-- Content -->
    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="flex justify-between items-start flex-wrap gap-4 mb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-ink">Propietarios</h1>
          <p class="text-ink-muted text-sm mt-1">Registro y administración de dueños de mascotas.</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div v-if="cargando && propietarios.length === 0" class="text-center py-12 text-ink-muted text-sm">
          Cargando propietarios…
        </div>
        <TablaPropietarios
          v-else
          :propietarios="propietariosFiltrados"
          :eliminando-id="eliminandoId"
          @editar="abrirModal"
          @eliminar="confirmarEliminar"
        />
        <div class="flex justify-between items-center px-4 py-3 border-t border-border flex-wrap gap-2">
          <span class="text-xs text-ink-muted">
            Mostrando {{ propietariosFiltrados.length }} de {{ propietarios.length }} propietarios
          </span>
        </div>
      </div>
    </main>

    <!-- Add / Edit modal -->
    <ModalEditarPropietario
      v-if="propietarioSeleccionado"
      :propietario="propietarioSeleccionado"
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
        <h3 class="text-base font-bold text-ink mb-3">¿Eliminar propietario?</h3>
        <p class="text-sm text-ink-muted mb-6 leading-relaxed">
          ¿Seguro que deseas eliminar a <strong class="text-ink">{{ aEliminar.nombreCompleto }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="aEliminar = null"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button @click="eliminar" :disabled="eliminandoId !== null"
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
import { Search, Plus } from 'lucide-vue-next'
import { propietariosService } from '../services/propietariosService.js'
import TablaPropietarios from './TablaPropietarios.vue'
import ModalEditarPropietario from './ModalEditarPropietario.vue'
import AlertMessage from './AlertMessage.vue'

const propietarios = ref([])
const cargando = ref(false)
const busqueda = ref('')
const propietarioSeleccionado = ref(null)
const modoModal = ref('editar')
const guardando = ref(false)
const aEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const propietariosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return propietarios.value
  return propietarios.value.filter((p) =>
    p.nombreCompleto?.toLowerCase().includes(q) || p.dui?.toLowerCase().includes(q)
  )
})

async function cargar() {
  cargando.value = true
  try {
    propietarios.value = await propietariosService.getAll()
  } catch (err) {
    mostrarAlerta('No se pudo cargar la lista. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

function abrirModal(p)     { modoModal.value = 'editar';  propietarioSeleccionado.value = { ...p } }
function abrirModalNuevo() { modoModal.value = 'agregar'; propietarioSeleccionado.value = {} }
function cerrarModal()     { propietarioSeleccionado.value = null }

async function guardarEdicion(datos) {
  guardando.value = true
  try {
    const updated = await propietariosService.update(datos.id, datos)
    const i = propietarios.value.findIndex((p) => p.id === datos.id)
    if (i !== -1) propietarios.value[i] = updated ?? datos
    cerrarModal()
    mostrarAlerta(`"${datos.nombreCompleto}" actualizado correctamente.`, 'success')
  } catch (err) {
    mostrarAlerta('Error al guardar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function crear(datos) {
  guardando.value = true
  try {
    const nuevo = await propietariosService.create(datos)
    propietarios.value.push(nuevo)
    cerrarModal()
    mostrarAlerta(`"${nuevo.nombreCompleto}" registrado correctamente.`, 'success')
  } catch (err) {
    mostrarAlerta('Error al registrar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(p) { aEliminar.value = p }

async function eliminar() {
  const p = aEliminar.value
  eliminandoId.value = p.id
  aEliminar.value = null
  try {
    await propietariosService.delete(p.id)
    propietarios.value = propietarios.value.filter((x) => x.id !== p.id)
    mostrarAlerta(`"${p.nombreCompleto}" eliminado.`, 'success')
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

onMounted(cargar)
</script>
