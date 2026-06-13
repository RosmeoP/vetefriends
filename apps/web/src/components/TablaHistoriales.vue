<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th class="th">Mascota</th>
          <th class="th">Fecha</th>
          <th class="th">Motivo</th>
          <th class="th">Diagnóstico</th>
          <th class="th">Tratamiento</th>
          <th class="th">Veterinario</th>
          <th class="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="historiales.length === 0">
          <td colspan="7" class="text-center py-12 text-ink-muted text-sm">
            No hay consultas registradas.
          </td>
        </tr>
        <tr v-for="h in historiales" :key="h.id"
          :class="eliminandoId === h.id ? 'opacity-30 pointer-events-none' : 'hover:bg-parchment/40'"
          class="border-b border-border last:border-0 transition-colors">

          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-parchment border-2 border-border flex items-center justify-center flex-shrink-0">
                <PawPrint class="w-4 h-4 text-border" />
              </div>
              <span class="font-semibold text-ink text-sm">{{ h.mascotaNombre || '—' }}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-ink-muted whitespace-nowrap">{{ formatDate(h.fecha) }}</td>
          <td class="px-4 py-3 text-ink">{{ h.motivo || '—' }}</td>
          <td class="px-4 py-3 text-ink-muted max-w-50 truncate" :title="h.diagnostico">{{ h.diagnostico || '—' }}</td>
          <td class="px-4 py-3 text-ink-muted max-w-50 truncate" :title="h.tratamiento">{{ h.tratamiento || '—' }}</td>
          <td class="px-4 py-3 text-ink-muted whitespace-nowrap">{{ h.veterinario || '—' }}</td>

          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <button @click="$emit('editar', h)" title="Editar"
                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button @click="$emit('eliminar', h)" :disabled="eliminandoId === h.id" title="Eliminar"
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
  historiales:  { type: Array,                  required: true },
  eliminandoId: { type: [Number, String, null], default: null },
})
defineEmits(['editar', 'eliminar'])

function formatDate(val) {
  if (!val) return '—'
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
