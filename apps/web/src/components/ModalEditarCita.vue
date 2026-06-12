<template>
  <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-50 overflow-y-auto py-6"
    @click.self="$emit('cancelar')">
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" role="dialog" aria-modal="true">
      <h2 class="text-lg font-extrabold text-ink mb-6">
        {{ modo === 'agregar' ? 'Nueva Cita' : 'Editar Cita' }}
      </h2>

      <form @submit.prevent="guardar" class="space-y-4">

        <!-- Paciente -->
        <div class="flex flex-col gap-1">
          <label for="paciente" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Paciente</label>
          <select id="paciente" v-model="form.pacienteId" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors appearance-none">
            <option value="" disabled>— Selecciona un paciente —</option>
            <option v-for="p in pacientes" :key="p.id" :value="p.id">
              {{ p.nombre }}{{ p.raza ? ` · ${p.raza}` : '' }}
            </option>
          </select>
          <p v-if="pacientes.length === 0" class="text-xs text-amber-600">
            No hay pacientes registrados. Crea uno en la sección Pacientes primero.
          </p>
        </div>

        <!-- Fecha + Hora -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label for="fecha" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Fecha</label>
            <input id="fecha" type="date" v-model="form.fecha" required
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="hora" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Hora</label>
            <input id="hora" type="time" v-model="form.hora" required
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
        </div>

        <!-- Motivo -->
        <div class="flex flex-col gap-1">
          <label for="motivo" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Motivo</label>
          <input id="motivo" type="text" v-model="form.motivo" required
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <!-- Veterinario -->
        <div class="flex flex-col gap-1">
          <label for="veterinario" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Veterinario</label>
          <input id="veterinario" type="text" v-model="form.veterinario"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <!-- Estado -->
        <div class="flex flex-col gap-1">
          <label for="estado" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Estado</label>
          <select id="estado" v-model="form.estado"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors appearance-none">
            <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('cancelar')"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="guardando"
            class="px-4 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ guardando ? 'Guardando…' : modo === 'agregar' ? 'Agendar cita' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  cita:      { type: Object,  required: true },
  pacientes: { type: Array,   default: () => [] },
  guardando: { type: Boolean, default: false },
  modo:      { type: String,  default: 'editar' },
})
const emit = defineEmits(['guardar', 'cancelar'])

const estados = ['Programada', 'Confirmada', 'Completada', 'Cancelada']

function normalizar(c) {
  return {
    pacienteId:  c.pacienteId ?? '',
    fecha:       c.fecha ?? '',
    hora:        c.hora ?? '',
    motivo:      c.motivo ?? '',
    veterinario: c.veterinario ?? '',
    estado:      c.estado ?? 'Programada',
    id:          c.id,
  }
}

const form = ref(normalizar(props.cita))
watch(() => props.cita, (v) => { form.value = normalizar(v) })

function guardar() { emit('guardar', { ...form.value }) }
</script>
