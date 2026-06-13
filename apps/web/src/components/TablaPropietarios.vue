<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th class="th">Nombre completo</th>
          <th class="th">DUI</th>
          <th class="th">Teléfono</th>
          <th class="th">Correo</th>
          <th class="th">Dirección</th>
          <th class="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="propietarios.length === 0">
          <td colspan="6" class="text-center py-12 text-ink-muted text-sm">
            No hay propietarios registrados.
          </td>
        </tr>
        <tr v-for="p in propietarios" :key="p.id"
          :class="eliminandoId === p.id ? 'opacity-30 pointer-events-none' : 'hover:bg-parchment/40'"
          class="border-b border-border last:border-0 transition-colors">

          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-forest-mid/10 text-forest-mid flex items-center justify-center flex-shrink-0">
                <UserRound class="w-4 h-4" />
              </div>
              <span class="font-semibold text-ink text-sm">{{ p.nombreCompleto || '—' }}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-ink whitespace-nowrap">{{ p.dui || '—' }}</td>
          <td class="px-4 py-3 text-ink-muted whitespace-nowrap">{{ p.telefono || '—' }}</td>
          <td class="px-4 py-3 text-ink-muted">{{ p.correo || '—' }}</td>
          <td class="px-4 py-3 text-ink-muted">{{ p.direccion || '—' }}</td>

          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
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
import { Pencil, Trash2, UserRound } from 'lucide-vue-next'

defineProps({
  propietarios: { type: Array,                  required: true },
  eliminandoId: { type: [Number, String, null], default: null },
})
defineEmits(['editar', 'eliminar'])
</script>

<style scoped>
@reference "../assets/tailwind.css";
.th {
  @apply px-4 py-3 text-left text-xs font-bold text-ink-muted uppercase tracking-wider bg-white;
}
</style>
