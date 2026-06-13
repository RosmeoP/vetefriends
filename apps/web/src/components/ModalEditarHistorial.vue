<template>
  <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-50 overflow-y-auto py-6"
    @click.self="$emit('cancelar')">
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" role="dialog" aria-modal="true">
      <h2 class="text-lg font-extrabold text-ink mb-6">
        {{ modo === 'agregar' ? 'Nueva Consulta' : 'Editar Consulta' }}
      </h2>

      <form @submit.prevent="guardar" class="space-y-4">
        <!-- Mascota (solo en la pantalla global de Historial Médico) -->
        <div v-if="pedirMascota" class="flex flex-col gap-1">
          <label for="mascota" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Mascota</label>
          <select id="mascota" v-model="form.mascotaId" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors appearance-none">
            <option value="" disabled>— Selecciona una mascota —</option>
            <option v-for="m in mascotas" :key="m.id" :value="m.id">
              {{ m.nombre }}{{ m.raza ? ` · ${m.raza}` : '' }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label for="fecha" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Fecha</label>
            <input id="fecha" type="date" v-model="form.fecha" required
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="veterinario" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Veterinario</label>
            <input id="veterinario" type="text" v-model="form.veterinario" required
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="motivo" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Motivo</label>
          <input id="motivo" type="text" v-model="form.motivo" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="diagnostico" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Diagnóstico</label>
          <textarea id="diagnostico" v-model="form.diagnostico" rows="2" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors resize-none" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="tratamiento" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Tratamiento</label>
          <textarea id="tratamiento" v-model="form.tratamiento" rows="2" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors resize-none" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('cancelar')"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="guardando"
            class="px-4 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ guardando ? 'Guardando…' : modo === 'agregar' ? 'Agregar consulta' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  historial:    { type: Object,  required: true },
  mascotas:     { type: Array,   default: () => [] },
  pedirMascota: { type: Boolean, default: false },
  guardando:    { type: Boolean, default: false },
  modo:         { type: String,  default: 'editar' },
})
const emit = defineEmits(['guardar', 'cancelar'])

function normalizar(h) {
  return {
    fecha:       h.fecha ?? new Date().toISOString().slice(0, 10),
    motivo:      h.motivo ?? '',
    diagnostico: h.diagnostico ?? '',
    tratamiento: h.tratamiento ?? '',
    veterinario: h.veterinario ?? '',
    mascotaId:   h.mascotaId ?? '',
    id:          h.id,
  }
}

const form = ref(normalizar(props.historial))
watch(() => props.historial, (v) => { form.value = normalizar(v) })

function guardar() { emit('guardar', { ...form.value }) }
</script>
