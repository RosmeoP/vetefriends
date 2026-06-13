<template>
  <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-50 overflow-y-auto py-6"
    @click.self="$emit('cancelar')">
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" role="dialog" aria-modal="true">
      <h2 class="text-lg font-extrabold text-ink mb-6">
        {{ modo === 'agregar' ? 'Nuevo Paciente' : 'Editar Paciente' }}
      </h2>

      <form @submit.prevent="guardar" class="space-y-4">

        <!-- Text / number inputs -->
        <div v-for="field in textFields" :key="field.id" class="flex flex-col gap-1">
          <label :for="field.id" class="text-xs font-bold text-ink-muted uppercase tracking-wide">
            {{ field.label }}
          </label>
          <input
            :id="field.id" :type="field.type" v-model="form[field.model]"
            :min="field.min" :step="field.step" :required="field.required"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <!-- Propietario (select — referencia) -->
        <div class="flex flex-col gap-1">
          <label for="propietario" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Propietario</label>
          <select id="propietario" v-model="form.propietarioId"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors appearance-none">
            <option value="">— Sin asignar —</option>
            <option v-for="p in propietarios" :key="p.id" :value="p.id">{{ p.nombreCompleto }}</option>
          </select>
          <p v-if="propietarios.length === 0" class="text-xs text-amber-600">
            No hay propietarios. Regístralos en la sección Propietarios para poder asignarlos.
          </p>
        </div>

        <!-- Estado (select) -->
        <div class="flex flex-col gap-1">
          <label for="estado" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Estado</label>
          <select id="estado" v-model="form.estado"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors appearance-none">
            <option value="">— Sin estado —</option>
            <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>

        <!-- Diagnóstico -->
        <div class="flex flex-col gap-1">
          <label for="diagnostico" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Diagnóstico</label>
          <textarea id="diagnostico" v-model="form.diagnostico" rows="3"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors resize-none" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('cancelar')"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="guardando"
            class="px-4 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ guardando ? 'Guardando…' : modo === 'agregar' ? 'Agregar paciente' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  paciente:   { type: Object,  required: true },
  propietarios: { type: Array, default: () => [] },
  guardando:  { type: Boolean, default: false },
  modo:       { type: String,  default: 'editar' },
})
const emit = defineEmits(['guardar', 'cancelar'])

const estados = [
  'Ingresado',
  'En espera',
  'En cirugía',
  'Hospitalizado',
  'De alta',
  'Seguimiento',
  'Emergencia',
]

const textFields = [
  { id: 'nombre',      label: 'Nombre',      model: 'nombre',      type: 'text',   required: true },
  { id: 'raza',        label: 'Raza',        model: 'raza',        type: 'text',   required: true },
  { id: 'edad',        label: 'Edad (años)', model: 'edad',        type: 'number', required: true, min: 0 },
  { id: 'peso',        label: 'Peso (kg)',   model: 'peso',        type: 'number', min: 0, step: 0.1 },
]

const form = ref({ ...props.paciente })
watch(() => props.paciente, (v) => { form.value = { ...v } })

function guardar() { emit('guardar', { ...form.value }) }
</script>
