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
            @blur="tocar(field.model)"
            :class="['border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:bg-white transition-colors',
              errores[field.model] && tocados[field.model] ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-forest-mid']" />
          <p v-if="errores[field.model] && tocados[field.model]" class="text-xs text-red-500">
            {{ errores[field.model] }}
          </p>
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
import { ref, watch, computed } from 'vue'

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
const tocados = ref({})
watch(() => props.propietario, (v) => { form.value = normalizar(v); tocados.value = {} })

function tocar(model) { tocados.value[model] = true }

const errores = computed(() => {
  const f = form.value
  const e = {}

  if (!f.nombreCompleto.trim())
    e.nombreCompleto = 'El nombre es requerido.'
  else if (f.nombreCompleto.trim().length < 3)
    e.nombreCompleto = 'El nombre debe tener al menos 3 caracteres.'

  if (!f.dui.trim())
    e.dui = 'El DUI es requerido.'
  else if (!/^\d{8}-\d$/.test(f.dui.trim()))
    e.dui = 'Formato inválido. Usa: 01234567-8'

  if (!f.telefono.trim())
    e.telefono = 'El teléfono es requerido.'
  else if (!/^\d{4}-\d{4}$/.test(f.telefono.trim()))
    e.telefono = 'Formato inválido. Usa: 7123-4567'

  if (!f.correo.trim())
    e.correo = 'El correo es requerido.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo.trim()))
    e.correo = 'Ingresa un correo válido.'

  if (!f.direccion.trim())
    e.direccion = 'La dirección es requerida.'
  else if (f.direccion.trim().length < 5)
    e.direccion = 'La dirección debe tener al menos 5 caracteres.'

  return e
})

function guardar() {
  // Mark all fields as touched to show all errors
  fields.forEach(f => { tocados.value[f.model] = true })
  if (Object.keys(errores.value).length > 0) return
  emit('guardar', { ...form.value })
}
</script>
