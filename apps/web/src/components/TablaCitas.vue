<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th class="th">Paciente</th>
          <th class="th">Fecha</th>
          <th class="th">Hora</th>
          <th class="th">Motivo</th>
          <th class="th">Veterinario</th>
          <th class="th">Estado</th>
          <th class="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="citas.length === 0">
          <td colspan="7" class="text-center py-12 text-ink-muted text-sm">
            No hay citas registradas.
          </td>
        </tr>
        <tr v-for="c in citas" :key="c.id"
          :class="eliminandoId === c.id ? 'opacity-30 pointer-events-none' : 'hover:bg-parchment/40'"
          class="border-b border-border last:border-0 transition-colors">

          <!-- Paciente -->
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-parchment border-2 border-border flex items-center justify-center flex-shrink-0">
                <PawPrint class="w-4 h-4 text-border" />
              </div>
              <span class="font-semibold text-ink text-sm">{{ c.pacienteNombre || '—' }}</span>
            </div>
          </td>

          <!-- Fecha -->
          <td class="px-4 py-3 text-ink-muted whitespace-nowrap">{{ formatDate(c.fecha) }}</td>

          <!-- Hora -->
          <td class="px-4 py-3 text-ink whitespace-nowrap">{{ c.hora || '—' }}</td>

          <!-- Motivo -->
          <td class="px-4 py-3 text-ink">{{ c.motivo || '—' }}</td>

          <!-- Veterinario -->
          <td class="px-4 py-3 text-ink-muted">{{ c.veterinario || '—' }}</td>

          <!-- Estado -->
          <td class="px-4 py-3">
            <span :class="estadoStyle(c.estado).badge"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
              <span :class="estadoStyle(c.estado).dot" class="w-1.5 h-1.5 rounded-full flex-shrink-0"></span>
              {{ c.estado || 'Sin estado' }}
            </span>
          </td>

          <!-- Acciones -->
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <button @click="$emit('editar', c)" title="Editar"
                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button @click="$emit('eliminar', c)" :disabled="eliminandoId === c.id" title="Eliminar"
                class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Pencil, Trash2, PawPrint } from 'lucide-vue-next'

defineProps({
  citas:        { type: Array,                  required: true },
  eliminandoId: { type: [Number, String, null], default: null },
})
defineEmits(['editar', 'eliminar'])

// ── Status styles ──
const ESTADOS = {
  'programada': { badge: 'bg-sky-100 text-sky-800',         dot: 'bg-sky-500'     },
  'confirmada': { badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  'completada': { badge: 'bg-indigo-100 text-indigo-800',   dot: 'bg-indigo-400'  },
  'cancelada':  { badge: 'bg-red-100 text-red-800',         dot: 'bg-red-500'     },
}
const DEFAULT_ESTADO = { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }

function estadoStyle(estado = '') {
  return ESTADOS[estado.toLowerCase()] ?? DEFAULT_ESTADO
}

function formatDate(val) {
  if (!val) return '—'
  // val is YYYY-MM-DD; parse as local date to avoid timezone drift
  const [y, m, d] = String(val).split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, d || 1)
  return isNaN(date) ? val : date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
@reference "../assets/tailwind.css";
.th {
  @apply px-4 py-3 text-left text-xs font-bold text-ink-muted uppercase tracking-wider bg-white;
}
</style>
