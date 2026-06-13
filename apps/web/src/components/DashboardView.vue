<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Dashboard</h2>
    </header>

    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-ink">Resumen general</h1>
        <p class="text-ink-muted text-sm mt-1">Vista rápida de la actividad de la clínica.</p>
      </div>

      <div v-if="cargando" class="text-center py-16 text-ink-muted text-sm">Cargando datos…</div>

      <template v-else>
        <!-- Stat cards (clickable → navigate) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button v-for="s in stats" :key="s.vista" @click="$emit('navegar', s.vista)"
            class="bg-white border border-border rounded-xl p-5 flex items-start gap-4 text-left hover:border-forest-mid hover:shadow-sm transition-all">
            <div :class="s.iconBg" class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
              <component :is="s.icon" class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs text-ink-muted mb-1">{{ s.label }}</div>
              <div class="text-2xl font-extrabold text-ink">{{ s.value }}</div>
            </div>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <!-- Próximas citas -->
          <section class="bg-white border border-border rounded-xl overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 border-b border-border">
              <div class="flex items-center gap-2">
                <CalendarDays class="w-4 h-4 text-forest-mid" />
                <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Próximas citas</h2>
              </div>
              <button @click="$emit('navegar', 'citas')" class="text-xs font-semibold text-forest-mid hover:underline">Ver todas</button>
            </div>
            <div v-if="proximasCitas.length === 0" class="text-center py-8 text-ink-muted text-sm">Sin citas próximas.</div>
            <ul v-else class="divide-y divide-border">
              <li v-for="c in proximasCitas" :key="c.id" class="px-5 py-3 flex items-center gap-3 flex-wrap">
                <span class="text-xs font-bold text-forest-mid bg-forest-mid/10 px-2 py-0.5 rounded whitespace-nowrap">
                  {{ formatDate(c.fecha) }} · {{ c.hora }}
                </span>
                <span class="font-semibold text-ink text-sm flex-1 min-w-0 truncate">{{ c.pacienteNombre || '—' }}</span>
                <span class="text-xs text-ink-muted truncate">{{ c.motivo }}</span>
              </li>
            </ul>
          </section>

          <!-- Stock bajo -->
          <section class="bg-white border border-border rounded-xl overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 border-b border-border">
              <div class="flex items-center gap-2">
                <TriangleAlert class="w-4 h-4 text-amber-500" />
                <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Stock bajo</h2>
              </div>
              <button @click="$emit('navegar', 'inventario')" class="text-xs font-semibold text-forest-mid hover:underline">Inventario</button>
            </div>
            <div v-if="stockBajo.length === 0" class="text-center py-8 text-ink-muted text-sm">Todo el inventario está en buen nivel.</div>
            <ul v-else class="divide-y divide-border">
              <li v-for="p in stockBajo" :key="p.id" class="px-5 py-3 flex items-center gap-3">
                <span class="font-semibold text-ink text-sm flex-1 min-w-0 truncate">{{ p.nombre }}</span>
                <span class="text-xs text-ink-muted">{{ p.categoria || '—' }}</span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                  {{ p.cantidad ?? 0 }} u.
                </span>
              </li>
            </ul>
          </section>
        </div>

        <!-- Últimas consultas -->
        <section class="bg-white border border-border rounded-xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-border">
            <div class="flex items-center gap-2">
              <ClipboardPlus class="w-4 h-4 text-forest-mid" />
              <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Últimas consultas</h2>
            </div>
            <button @click="$emit('navegar', 'historial')" class="text-xs font-semibold text-forest-mid hover:underline">Historial médico</button>
          </div>
          <div v-if="ultimasConsultas.length === 0" class="text-center py-8 text-ink-muted text-sm">Sin consultas registradas.</div>
          <ul v-else class="divide-y divide-border">
            <li v-for="h in ultimasConsultas" :key="h.id" class="px-5 py-3 flex items-center gap-3 flex-wrap">
              <span class="text-xs font-bold text-forest-mid bg-forest-mid/10 px-2 py-0.5 rounded whitespace-nowrap">{{ formatDate(h.fecha) }}</span>
              <span class="font-semibold text-ink text-sm">{{ h.mascotaNombre || '—' }}</span>
              <span class="text-xs text-ink-muted flex-1 min-w-0 truncate">{{ h.motivo }}</span>
              <span class="text-xs text-ink-muted">{{ h.veterinario || '—' }}</span>
            </li>
          </ul>
        </section>
      </template>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PawPrint, Users, CalendarDays, Package, TriangleAlert, ClipboardPlus } from 'lucide-vue-next'
import { pacientesService } from '../services/pacientesService.js'
import { propietariosService } from '../services/propietariosService.js'
import { citasService } from '../services/citasService.js'
import { inventarioService } from '../services/inventarioService.js'
import { historialesService } from '../services/historialesService.js'
import AlertMessage from './AlertMessage.vue'

defineEmits(['navegar'])

const pacientes = ref([])
const propietarios = ref([])
const citas = ref([])
const productos = ref([])
const historiales = ref([])
const cargando = ref(false)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

const stats = computed(() => [
  { label: 'Pacientes',    value: pacientes.value.length,    vista: 'pacientes',    icon: PawPrint,     iconBg: 'bg-emerald-100 text-emerald-700' },
  { label: 'Propietarios', value: propietarios.value.length, vista: 'propietarios', icon: Users,        iconBg: 'bg-forest-mid/10 text-forest-mid' },
  { label: 'Citas',        value: citas.value.length,        vista: 'citas',        icon: CalendarDays, iconBg: 'bg-sky-100 text-sky-700' },
  { label: 'Productos',    value: productos.value.length,    vista: 'inventario',   icon: Package,      iconBg: 'bg-amber-100 text-amber-700' },
])

function hoyLocal() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const proximasCitas = computed(() => {
  const hoy = hoyLocal()
  return citas.value
    .filter((c) => c.fecha && c.fecha >= hoy && c.estado !== 'Cancelada' && c.estado !== 'Completada')
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5)
})

const stockBajo = computed(() =>
  productos.value.filter((p) => (p.cantidad ?? 0) <= 5).sort((a, b) => (a.cantidad ?? 0) - (b.cantidad ?? 0)).slice(0, 5)
)

// historiales come sorted by fechaConsulta desc from the API
const ultimasConsultas = computed(() => historiales.value.slice(0, 5))

async function cargar() {
  cargando.value = true
  try {
    const [pac, prop, cit, prod, hist] = await Promise.all([
      pacientesService.getAll(),
      propietariosService.getAll(),
      citasService.getAll(),
      inventarioService.getAll(),
      historialesService.getAll(),
    ])
    pacientes.value = pac
    propietarios.value = prop
    citas.value = cit
    productos.value = prod
    historiales.value = hist
  } catch (err) {
    mostrarAlerta('No se pudieron cargar los datos. ' + err.message, 'error')
  } finally {
    cargando.value = false
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
