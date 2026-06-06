<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th class="th">Paciente</th>
          <th class="th">Raza</th>
          <th class="th">Estado</th>
          <th class="th">Última Visita</th>
          <th class="th">Edad / Peso</th>
          <th class="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pacientes.length === 0">
          <td colspan="6" class="text-center py-12 text-ink-muted text-sm">
            No hay pacientes registrados.
          </td>
        </tr>
        <tr v-for="p in pacientes" :key="p.id"
          :class="eliminandoId === p.id ? 'opacity-30 pointer-events-none' : 'hover:bg-parchment/50'"
          class="border-b border-border last:border-0 transition-colors">

          <!-- Paciente -->
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                :style="{ background: avatarColor(p.nombre) }">
                {{ initials(p.nombre) }}
              </div>
              <div>
                <div class="font-semibold text-ink text-sm">{{ p.nombre }}</div>
                <div class="text-xs text-ink-muted">ID: #CAN-{{ String(p.id).padStart(3, '0') }}</div>
              </div>
            </div>
          </td>

          <!-- Raza -->
          <td class="px-4 py-3.5 text-ink">{{ p.raza || '—' }}</td>

          <!-- Estado -->
          <td class="px-4 py-3.5">
            <span :class="badgeClass(p.estado)"
              class="inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
              {{ p.estado || 'Sin estado' }}
            </span>
          </td>

          <!-- Última visita -->
          <td class="px-4 py-3.5 text-ink-muted whitespace-nowrap">{{ formatDate(p.ultimaVisita || p.created_at) }}</td>

          <!-- Edad / Peso -->
          <td class="px-4 py-3.5">
            <div class="font-semibold text-ink text-sm">{{ p.edad != null ? p.edad + ' año' + (p.edad !== 1 ? 's' : '') : '—' }}</div>
            <div class="text-xs text-ink-muted">{{ p.peso ? p.peso + ' kg' : '—' }}</div>
          </td>

          <!-- Acciones -->
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-2">
              <button @click="$emit('editar', p)" title="Editar"
                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button @click="$emit('eliminar', p)" :disabled="eliminandoId === p.id" title="Eliminar"
                class="w-8 h-8 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  pacientes:    { type: Array,                  required: true },
  eliminandoId: { type: [Number, String, null], default: null },
})
defineEmits(['editar', 'eliminar'])

function initials(nombre = '') {
  return nombre.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

const COLORS = ['#5c8f6a','#c9a84c','#7b6ea6','#c07a5a','#4a7fa5','#6e9e7e','#a06070']
function avatarColor(nombre = '') {
  let h = 0
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) & 0xffffffff
  return COLORS[Math.abs(h) % COLORS.length]
}

function badgeClass(estado = '') {
  const e = estado.toLowerCase()
  if (e.includes('ingres') || e.includes('check') || e.includes('activ')) return 'bg-emerald-100 text-emerald-700'
  if (e.includes('espera') || e.includes('wait'))                          return 'bg-amber-100 text-amber-700'
  if (e.includes('cirug') || e.includes('surgery') || e.includes('emerg')) return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

function formatDate(val) {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
@reference "../assets/tailwind.css";

.th {
  @apply px-4 py-3 text-left text-xs font-bold text-ink-muted uppercase tracking-wider bg-white;
}
</style>
