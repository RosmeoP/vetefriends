<template>
  <div class="fixed inset-0 bg-black/45 flex items-center justify-center z-50 overflow-y-auto py-6"
    @click.self="$emit('cancelar')">
    <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4" role="dialog" aria-modal="true">
      <h2 class="text-lg font-extrabold text-ink mb-6">
        {{ modo === 'agregar' ? 'Nuevo Propietario' : 'Editar Propietario' }}
      </h2>

      <form @submit.prevent="guardar" class="space-y-4">
        <div v-for="field in fields" :key="field.id" class="flex flex-col gap-1">
          <label :for="field.id" class="text-xs font-bold text-ink-muted uppercase tracking-wide">
            {{ field.label }}
          </label>
          <input
            :id="field.id" :type="field.type" v-model="form[field.model]" :required="field.required"
            :placeholder="field.placeholder ?? ''"
            :maxlength="field.maxlength ?? undefined"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('cancelar')"
            class="px-4 py-2 bg-parchment border border-border rounded-lg text-sm font-semibold text-ink hover:bg-parchment-dark transition-colors">
            Cancelar
          </button>
          <button type="submit" :disabled="guardando"
            class="px-4 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ guardando ? 'Guardando…' : modo === 'agregar' ? 'Agregar propietario' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  propietario: { type: Object,  required: true },
  guardando:   { type: Boolean, default: false },
  modo:        { type: String,  default: 'editar' },
})
const emit = defineEmits(['guardar', 'cancelar'])

const fields = [
  { id: 'nombreCompleto', label: 'Nombre completo',   model: 'nombreCompleto', type: 'text',  required: true, placeholder: 'Ej: Juan Carlos Pérez' },
  { id: 'dui',            label: 'DUI',               model: 'dui',            type: 'text',  required: true, placeholder: 'Ej: 01234567-8', maxlength: 10 },
  { id: 'telefono',       label: 'Teléfono',          model: 'telefono',       type: 'tel',   required: true, placeholder: 'Ej: 7123-4567', maxlength: 9 },
  { id: 'correo',         label: 'Correo electrónico', model: 'correo',        type: 'email', required: true, placeholder: 'Ej: juan.perez@gmail.com' },
  { id: 'direccion',      label: 'Dirección',          model: 'direccion',     type: 'text',  required: true, placeholder: 'Ej: Col. Escalón, Calle El Pedregal #12, San Salvador' },
]

function normalizar(p) {
  return {
    nombreCompleto: p.nombreCompleto ?? '',
    dui:            p.dui ?? '',
    telefono:       p.telefono ?? '',
    correo:         p.correo ?? '',
    direccion:      p.direccion ?? '',
    id:             p.id,
  }
}

const form = ref(normalizar(props.propietario))
watch(() => props.propietario, (v) => { form.value = normalizar(v) })

function guardar() { emit('guardar', { ...form.value }) }
</script>
