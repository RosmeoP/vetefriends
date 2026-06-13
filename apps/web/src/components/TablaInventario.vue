<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th class="th">Producto</th>
          <th class="th">Categoría</th>
          <th class="th">Stock</th>
          <th class="th">Precio</th>
          <th class="th">Descripción</th>
          <th class="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="productos.length === 0">
          <td colspan="6" class="text-center py-12 text-ink-muted text-sm">
            No hay productos registrados.
          </td>
        </tr>
        <tr v-for="p in productos" :key="p.id"
          :class="eliminandoId === p.id ? 'opacity-30 pointer-events-none' : 'hover:bg-parchment/40'"
          class="border-b border-border last:border-0 transition-colors">

          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-forest-mid/10 text-forest-mid flex items-center justify-center flex-shrink-0">
                <Package class="w-4 h-4" />
              </div>
              <span class="font-semibold text-ink text-sm">{{ p.nombre }}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-ink-muted">{{ p.categoria || '—' }}</td>
          <td class="px-4 py-3">
            <span :class="stockBadge(p.cantidad)"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
              {{ p.cantidad ?? 0 }} u.
              <span v-if="esBajo(p.cantidad)" class="text-[10px] font-bold uppercase">· bajo</span>
            </span>
          </td>
          <td class="px-4 py-3 text-ink whitespace-nowrap">{{ formatPrecio(p.precio) }}</td>
          <td class="px-4 py-3 text-ink-muted max-w-60 truncate" :title="p.descripcion">{{ p.descripcion || '—' }}</td>

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
import { Package, Pencil, Trash2 } from 'lucide-vue-next'

const LOW_STOCK = 5

defineProps({
  productos:    { type: Array,                  required: true },
  eliminandoId: { type: [Number, String, null], default: null },
})
defineEmits(['editar', 'eliminar'])

function esBajo(cantidad) {
  return (cantidad ?? 0) <= LOW_STOCK
}
function stockBadge(cantidad) {
  return esBajo(cantidad)
    ? 'bg-amber-100 text-amber-800'
    : 'bg-emerald-100 text-emerald-800'
}
function formatPrecio(v) {
  if (v == null || v === '') return '—'
  return '$' + Number(v).toFixed(2)
}
</script>

<style scoped>
@reference "../assets/tailwind.css";
.th {
  @apply px-4 py-3 text-left text-xs font-bold text-ink-muted uppercase tracking-wider bg-white;
}
</style>
