<template>
  <div class="flex-1 min-w-0 flex flex-col">

    <!-- Topbar -->
    <header class="bg-white border-b border-border px-7 py-3 flex items-center gap-4 sticky top-0 z-10">
      <h2 class="text-sm font-bold text-ink whitespace-nowrap">Soporte y Ayuda</h2>
    </header>

    <main class="p-6 flex-1">
      <AlertMessage :message="alerta.mensaje" :type="alerta.tipo" @close="cerrarAlerta" />

      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-ink">Centro de Ayuda</h1>
        <p class="text-ink-muted text-sm mt-1">¿Necesitas ayuda con VeteFriends? Estamos aquí para apoyarte.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contact Cards -->
        <div class="space-y-4">
          <section class="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-forest-mid/10 text-forest-mid flex items-center justify-center">
                <LifeBuoy class="w-5 h-5" />
              </div>
              <h2 class="text-lg font-bold text-ink">Soporte Técnico</h2>
            </div>
            <p class="text-sm text-ink-muted mb-4">
              Nuestro equipo está disponible para resolver cualquier inconveniente técnico que puedas tener con la plataforma.
            </p>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <Mail class="w-4 h-4 text-forest-mid" />
                <span class="text-ink">mrmauricio503@gmail.com</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <Phone class="w-4 h-4 text-forest-mid" />
                <span class="text-ink">77442947</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <Clock class="w-4 h-4 text-forest-mid" />
                <span class="text-ink">Lun–Vie 8:00 a. m. – 4:00 p. m.</span>
              </div>
            </div>
          </section>

          <section class="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-ink mb-4">Preguntas Frecuentes</h2>
            <div class="space-y-4">
              <details class="group border-b border-border pb-3 last:border-0">
                <summary class="flex justify-between items-center font-semibold text-sm text-ink cursor-pointer list-none">
                  ¿Cómo registro un nuevo paciente?
                  <ChevronDown class="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <p class="text-xs text-ink-muted mt-2">
                  Ve a la sección de "Pacientes" y haz clic en el botón "Nuevo Paciente". Completa los datos de la mascota y asigna un propietario.
                </p>
              </details>
              <details class="group border-b border-border pb-3 last:border-0">
                <summary class="flex justify-between items-center font-semibold text-sm text-ink cursor-pointer list-none">
                  ¿Puedo editar el historial clínico?
                  <ChevronDown class="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <p class="text-xs text-ink-muted mt-2">
                  Sí, dentro del detalle de cada mascota, en la sección de "Historial clínico", puedes editar o eliminar consultas previas.
                </p>
              </details>
              <details class="group border-b border-border pb-3 last:border-0">
                <summary class="flex justify-between items-center font-semibold text-sm text-ink cursor-pointer list-none">
                  ¿Cómo gestiono el inventario?
                  <ChevronDown class="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <p class="text-xs text-ink-muted mt-2">
                  En la sección "Inventario" puedes agregar productos, actualizar stock y recibir alertas cuando un producto esté por agotarse.
                </p>
              </details>
            </div>
          </section>
        </div>

        <!-- Contact Form -->
        <section class="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-bold text-ink mb-2">Envíanos un mensaje</h2>
          <p class="text-sm text-ink-muted mb-6">Si tienes una duda específica o sugerencia, usa este formulario.</p>

          <form @submit.prevent="enviarMensaje" class="space-y-4">
            <div class="flex flex-col gap-1">
              <label for="asunto" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Asunto</label>
              <input id="asunto" type="text" v-model="form.asunto" required
                class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors"
                placeholder="Ej: Problema al agendar cita" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="mensaje" class="text-xs font-bold text-ink-muted uppercase tracking-wide">Mensaje</label>
              <textarea id="mensaje" v-model="form.mensaje" required rows="5"
                class="border border-border rounded-lg px-3 py-2 text-sm bg-parchment text-ink outline-none focus:border-forest-mid focus:bg-white transition-colors resize-none"
                placeholder="Cuéntanos más detalles..."></textarea>
            </div>

            <div class="flex justify-end pt-2">
              <button type="submit" :disabled="enviando"
                class="w-full sm:w-auto px-6 py-2 bg-forest-mid text-white rounded-lg text-sm font-bold hover:bg-forest disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LifeBuoy, Mail, Phone, Clock, ChevronDown } from 'lucide-vue-next'
import AlertMessage from './AlertMessage.vue'

const form = ref({ asunto: '', mensaje: '' })
const enviando = ref(false)
const alerta = ref({ mensaje: '', tipo: 'success' })
let alertaTimer = null

function enviarMensaje() {
  enviando.value = true
  // Simulamos envío
  setTimeout(() => {
    enviando.value = false
    form.value = { asunto: '', mensaje: '' }
    mostrarAlerta('Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.', 'success')
  }, 1500)
}

function mostrarAlerta(mensaje, tipo = 'success') {
  clearTimeout(alertaTimer)
  alerta.value = { mensaje, tipo }
  alertaTimer = setTimeout(cerrarAlerta, 5000)
}
function cerrarAlerta() { alerta.value = { mensaje: '', tipo: 'success' } }
</script>
