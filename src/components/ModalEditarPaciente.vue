<template>
  <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
    @click.self="$emit('cancelar')">
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" role="dialog" aria-modal="true">
      <h2 class="text-lg font-extrabold text-ink mb-6">
        {{ modo === 'agregar' ? 'Nuevo Paciente' : 'Editar Paciente' }}
      </h2>

      <form @submit.prevent="guardar" class="space-y-4">
        <div v-for="field in fields" :key="field.id" class="flex flex-col gap-1">
          <label :for="field.id" class="text-xs font-bold text-ink-muted uppercase tracking-wide">
            {{ field.label }}
          </label>
          <textarea v-if="field.type === 'textarea'"
            :id="field.id" v-model="form[field.model]" rows="3"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors resize-none" />
          <input v-else
            :id="field.id" :type="field.type" v-model="form[field.model]"
            :min="field.min" :required="field.required"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
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
  paciente:  { type: Object,  required: true },
  guardando: { type: Boolean, default: false },
  modo:      { type: String,  default: 'editar' }, // 'editar' | 'agregar'
})
const emit = defineEmits(['guardar', 'cancelar'])

const fields = [
  { id: 'nombre',      label: 'Nombre',       model: 'nombre',      type: 'text',     required: true },
  { id: 'raza',        label: 'Raza',         model: 'raza',        type: 'text',     required: true },
  { id: 'edad',        label: 'Edad (años)',  model: 'edad',        type: 'number',   required: true, min: 0 },
  { id: 'peso',        label: 'Peso (kg)',    model: 'peso',        type: 'number',   min: 0 },
  { id: 'propietario', label: 'Propietario',  model: 'propietario', type: 'text',     required: true },
  { id: 'telefono',    label: 'Teléfono',     model: 'telefono',    type: 'tel' },
  { id: 'estado',      label: 'Estado',       model: 'estado',      type: 'text' },
  { id: 'diagnostico', label: 'Diagnóstico',  model: 'diagnostico', type: 'textarea' },
]

const form = ref({ ...props.paciente })
watch(() => props.paciente, (v) => { form.value = { ...v } })

function guardar() { emit('guardar', { ...form.value }) }
</script>
