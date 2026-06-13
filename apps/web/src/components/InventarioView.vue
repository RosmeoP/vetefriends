<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Gestión de Inventario</h2>

      <div class="flex items-center gap-3 flex-1 flex-wrap">
        <div class="flex items-center gap-2 bg-parchment border border-border rounded-lg px-3 py-2 text-ink-muted">
          <Search class="w-4 h-4 flex-shrink-0" />
          <input v-model="busqueda" type="search" placeholder="Buscar por nombre o categoría…"
            class="bg-transparent border-none outline-none text-sm text-ink w-56 placeholder-ink-muted" />
        </div>
      </div>

      <button @click="abrirModalNuevo"
        class="ml-auto flex items-center gap-2 bg-forest-mid text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-forest transition-colors whitespace-nowrap">
        <Plus class="w-4 h-4" /> Nuevo Producto
      </button>
    </header>

    <!-- Content -->
    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="flex justify-between items-start flex-wrap gap-4 mb-5">
        <div>
          <h1 class="text-3xl font-extrabold text-ink">Inventario</h1>
          <p class="text-ink-muted text-sm mt-1">Control de productos, medicamentos y suministros.</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div v-if="cargando && productos.length === 0" class="text-center py-12 text-ink-muted text-sm">
          Cargando inventario…
        </div>
        <TablaInventario
          v-else
          :productos="productosFiltrados"
          :eliminando-id="eliminandoId"
          @editar="abrirModal"
          @eliminar="confirmarEliminar"
        />
        <div class="flex justify-between items-center px-4 py-3 border-t border-border flex-wrap gap-2">
          <span class="text-xs text-ink-muted">
            Mostrando {{ productosFiltrados.length }} de {{ productos.length }} productos
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-forest-mid/10 text-forest-mid flex items-center justify-center flex-shrink-0">
            <Package class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Productos</div>
            <div class="text-2xl font-extrabold text-ink">{{ productos.length }}</div>
          </div>
        </div>
        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <TriangleAlert class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Stock bajo (≤ 5)</div>
            <div class="text-2xl font-extrabold text-ink">{{ stockBajo }}</div>
          </div>
        </div>
        <div class="bg-white border border-border rounded-xl p-5 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <DollarSign class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-ink-muted mb-1">Valor total</div>
            <div class="text-2xl font-extrabold text-ink">${{ valorTotal }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add / Edit modal -->
    <ModalEditarProducto
      v-if="productoSeleccionado"
      :producto="productoSeleccionado"
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
        <h3 class="text-base font-bold text-ink mb-3">¿Eliminar producto?</h3>
        <p class="text-sm text-ink-muted mb-6 leading-relaxed">
          ¿Seguro que deseas eliminar <strong class="text-ink">{{ aEliminar.nombre }}</strong>?
          Esta acción no se puede deshacer.
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
import { Search, Plus, Package, TriangleAlert, DollarSign } from 'lucide-vue-next'
import { inventarioService } from '../services/inventarioService.js'
import TablaInventario from './TablaInventario.vue'
import ModalEditarProducto from './ModalEditarProducto.vue'
import AlertMessage from './AlertMessage.vue'

const productos = ref([])
const cargando = ref(false)
const busqueda = ref('')
const productoSeleccionado = ref(null)
const modoModal = ref('editar')
const guardando = ref(false)
const aEliminar = ref(null)
const eliminandoId = ref(null)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const productosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return productos.value
  return productos.value.filter((p) =>
    p.nombre?.toLowerCase().includes(q) || p.categoria?.toLowerCase().includes(q)
  )
})

const stockBajo = computed(() => productos.value.filter((p) => (p.cantidad ?? 0) <= 5).length)
const valorTotal = computed(() =>
  productos.value.reduce((sum, p) => sum + (Number(p.precio) || 0) * (Number(p.cantidad) || 0), 0).toFixed(2)
)

async function cargar() {
  cargando.value = true
  try {
    productos.value = await inventarioService.getAll()
  } catch (err) {
    mostrarAlerta('No se pudo cargar el inventario. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

function abrirModal(p)     { modoModal.value = 'editar';  productoSeleccionado.value = { ...p } }
function abrirModalNuevo() { modoModal.value = 'agregar'; productoSeleccionado.value = {} }
function cerrarModal()     { productoSeleccionado.value = null }

async function guardarEdicion(datos) {
  guardando.value = true
  try {
    const updated = await inventarioService.update(datos.id, datos)
    const i = productos.value.findIndex((p) => p.id === datos.id)
    if (i !== -1) productos.value[i] = updated ?? datos
    cerrarModal()
    mostrarAlerta(`"${datos.nombre}" actualizado correctamente.`, 'success')
  } catch (err) {
    mostrarAlerta('Error al guardar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function crear(datos) {
  guardando.value = true
  try {
    const nuevo = await inventarioService.create(datos)
    productos.value.unshift(nuevo)
    cerrarModal()
    mostrarAlerta(`"${nuevo.nombre}" registrado correctamente.`, 'success')
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
    await inventarioService.delete(p.id)
    productos.value = productos.value.filter((x) => x.id !== p.id)
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

onMounted(cargar)
</script>
