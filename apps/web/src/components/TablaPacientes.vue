<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th class="th">Paciente</th>
          <th class="th">Raza</th>
          <th class="th">Estado</th>
          <th class="th">Última Visita</th>
          <th class="th">Edad / Peso</th>
          <th class="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pacientes.length === 0">
          <td colspan="6" class="text-center py-12 text-ink-muted text-sm">
            No hay pacientes registrados.
          </td>
        </tr>
        <tr v-for="p in pacientes" :key="p.id"
          :class="eliminandoId === p.id ? 'opacity-30 pointer-events-none' : 'hover:bg-parchment/40'"
          class="border-b border-border last:border-0 transition-colors">

          <!-- Paciente -->
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full flex-shrink-0 bg-parchment border-2 border-border flex items-center justify-center">
                <PawPrint class="w-5 h-5 text-border" />
              </div>
              <div>
                <div class="font-semibold text-ink text-sm">{{ p.nombre }}</div>
                <div class="text-xs text-ink-muted">#CAN-{{ String(p.id).padStart(3, '0') }}</div>
              </div>
            </div>
          </td>

          <!-- Raza -->
          <td class="px-4 py-3 text-ink">{{ p.raza || '—' }}</td>

          <!-- Estado -->
          <td class="px-4 py-3">
            <span :class="estadoStyle(p.estado).badge"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
              <span :class="estadoStyle(p.estado).dot" class="w-1.5 h-1.5 rounded-full flex-shrink-0"></span>
              {{ p.estado || 'Sin estado' }}
            </span>
          </td>

          <!-- Última visita -->
          <td class="px-4 py-3 text-ink-muted whitespace-nowrap">{{ formatDate(p.ultimaVisita || p.created_at) }}</td>

          <!-- Edad / Peso -->
          <td class="px-4 py-3">
            <div class="font-semibold text-ink text-sm">{{ p.edad != null ? p.edad + ' año' + (p.edad !== 1 ? 's' : '') : '—' }}</div>
            <div class="text-xs text-ink-muted">{{ p.peso ? p.peso + ' kg' : '—' }}</div>
          </td>

          <!-- Acciones -->
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <button @click="$emit('ver', p)" title="Ver detalle"
                class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors">
                <Eye class="w-3.5 h-3.5" />
              </button>
              <button @click="$emit('editar', p)" title="Editar"
                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button @click="$emit('eliminar', p)" :disabled="eliminandoId === p.id" title="Eliminar"
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
import { Eye, Pencil, Trash2, PawPrint } from 'lucide-vue-next'

const props = defineProps({
  pacientes:    { type: Array,                  required: true },
  eliminandoId: { type: [Number, String, null], default: null },
})
defineEmits(['ver', 'editar', 'eliminar'])

// ── Status styles ──
const ESTADOS = {
  'ingresado':     { badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  'en espera':     { badge: 'bg-amber-100 text-amber-800',     dot: 'bg-amber-400'   },
  'en cirugía':    { badge: 'bg-red-100 text-red-800',         dot: 'bg-red-500'     },
  'cirugía':       { badge: 'bg-red-100 text-red-800',         dot: 'bg-red-500'     },
  'hospitalizado': { badge: 'bg-purple-100 text-purple-800',   dot: 'bg-purple-500'  },
  'de alta':       { badge: 'bg-sky-100 text-sky-800',         dot: 'bg-sky-500'     },
  'seguimiento':   { badge: 'bg-indigo-100 text-indigo-800',   dot: 'bg-indigo-400'  },
  'emergencia':    { badge: 'bg-rose-100 text-rose-800',       dot: 'bg-rose-600'    },
}
const DEFAULT_ESTADO = { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }

function estadoStyle(estado = '') {
  return ESTADOS[estado.toLowerCase()] ?? DEFAULT_ESTADO
}

function formatDate(val) {
  if (!val) return '—'
  const d = new Date(val)
  return isNaN(d) ? val : d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
@reference "../assets/tailwind.css";
.th {
  @apply px-4 py-3 text-left text-xs font-bold text-ink-muted uppercase tracking-wider bg-white;
}
</style>
