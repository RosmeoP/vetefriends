<template>
  <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-50 overflow-y-auto py-6"
    @click.self="$emit('cancelar')">
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" role="dialog" aria-modal="true">
      <h2 class="text-lg font-extrabold text-ink mb-6">
        {{ modo === 'agregar' ? 'Nuevo Producto' : 'Editar Producto' }}
      </h2>

      <form @submit.prevent="guardar" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label for="nombre" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Nombre</label>
          <input id="nombre" type="text" v-model="form.nombre" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="categoria" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Categoría</label>
          <input id="categoria" type="text" v-model="form.categoria" list="categorias-list"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          <datalist id="categorias-list">
            <option value="Medicamento" />
            <option value="Alimento" />
            <option value="Accesorio" />
            <option value="Higiene" />
            <option value="Material médico" />
          </datalist>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label for="cantidad" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Cantidad (stock)</label>
            <input id="cantidad" type="number" min="0" v-model="form.cantidad" required
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="precio" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Precio ($)</label>
            <input id="precio" type="number" min="0" step="0.01" v-model="form.precio"
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="descripcion" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Descripción</label>
          <textarea id="descripcion" v-model="form.descripcion" rows="2"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors resize-none" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('cancelar')"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="guardando"
            class="px-4 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ guardando ? 'Guardando…' : modo === 'agregar' ? 'Agregar producto' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  producto:  { type: Object,  required: true },
  guardando: { type: Boolean, default: false },
  modo:      { type: String,  default: 'editar' },
})
const emit = defineEmits(['guardar', 'cancelar'])

function normalizar(p) {
  return {
    nombre:      p.nombre ?? '',
    categoria:   p.categoria ?? '',
    cantidad:    p.cantidad ?? 0,
    precio:      p.precio ?? 0,
    descripcion: p.descripcion ?? '',
    id:          p.id,
  }
}

const form = ref(normalizar(props.producto))
watch(() => props.producto, (v) => { form.value = normalizar(v) })

function guardar() { emit('guardar', { ...form.value }) }
</script>
