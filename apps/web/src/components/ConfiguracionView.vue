<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Configuración</h2>
    </header>

    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-ink">Configuración</h1>
        <p class="text-ink-muted text-sm mt-1">Datos generales de la clínica.</p>
      </div>

      <div v-if="cargando" class="text-center py-16 text-ink-muted text-sm">Cargando…</div>

      <form v-else @submit.prevent="guardar" class="bg-white border border-border rounded-xl p-6 max-w-2xl space-y-4">
        <div class="flex items-center gap-2 mb-2">
          <Settings2 class="w-4 h-4 text-forest-mid" />
          <h2 class="text-sm font-bold text-ink uppercase tracking-wide">Perfil de la clínica</h2>
        </div>

        <div class="flex flex-col gap-1">
          <label for="nombreClinica" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Nombre de la clínica</label>
          <input id="nombreClinica" type="text" v-model="form.nombreClinica"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="telefono" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Teléfono</label>
            <input id="telefono" type="tel" v-model="form.telefono"
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="correo" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Correo electrónico</label>
            <input id="correo" type="email" v-model="form.correo"
              class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="direccion" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Dirección</label>
          <input id="direccion" type="text" v-model="form.direccion"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="horario" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Horario de atención</label>
          <input id="horario" type="text" v-model="form.horario" placeholder="Ej: Lun–Vie 8:00–17:00"
            class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors" />
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" :disabled="guardando"
            class="px-5 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Settings2 } from 'lucide-vue-next'
import { configuracionService } from '../services/configuracionService.js'
import AlertMessage from './AlertMessage.vue'

const form = ref({ nombreClinica: '', direccion: '', telefono: '', correo: '', horario: '', id: null })
const cargando = ref(false)
const guardando = ref(false)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

async function cargar() {
  cargando.value = true
  try {
    const data = await configuracionService.get()
    if (data) form.value = { ...form.value, ...data }
  } catch (err) {
    mostrarAlerta('No se pudo cargar la configuración. ' + err.message, 'error')
  } finally {
    cargando.value = false
  }
}

async function guardar() {
  guardando.value = true
  try {
    const updated = await configuracionService.update(form.value)
    if (updated) form.value = { ...form.value, ...updated }
    mostrarAlerta('Configuración guardada correctamente.', 'success')
  } catch (err) {
    mostrarAlerta('Error al guardar: ' + err.message, 'error')
  } finally {
    guardando.value = false
  }
}

function mostrarAlerta(mensaje, tipo = 'success') {
  clearTimeout(alertaTimer)
  alerta.value = { mensaje, tipo }
  alertaTimer = setTimeout(cerrarAlerta, 5000)
}
function cerrarAlerta() { alerta.value = { mensaje: '', tipo: 'success' } }

onMounted(cargar)
</script>
