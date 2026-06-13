<template>
  <div class="flex min-h-screen bg-parchment text-ink font-sans">

    <!-- ── Sidebar ── -->
    <aside class="w-55 min-w-55 bg-forest flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div class="flex items-center gap-3 px-4 py-5 border-b border-forest-border">
        <Dog class="text-gold w-7 h-7 flex-shrink-0" />
        <div>
          <div class="text-white font-bold text-sm leading-tight">VeteFriends</div>
          <div class="text-sidebar-text text-xs">Clínica Principal</div>
        </div>
      </div>

      <nav class="flex-1 py-3">
        <a href="#" class="nav-item">
          <LayoutDashboard class="w-4 h-4 flex-shrink-0" /> Dashboard
        </a>
        <button type="button" @click="vistaActiva = 'pacientes'"
          :class="vistaActiva === 'pacientes' && 'nav-item-active'" class="nav-item">
          <PawPrint class="w-4 h-4 flex-shrink-0" /> Pacientes
        </button>
        <button type="button" @click="vistaActiva = 'citas'"
          :class="vistaActiva === 'citas' && 'nav-item-active'" class="nav-item">
          <CalendarDays class="w-4 h-4 flex-shrink-0" /> Citas
        </button>
        <button type="button" @click="vistaActiva = 'propietarios'"
          :class="vistaActiva === 'propietarios' && 'nav-item-active'" class="nav-item">
          <Users class="w-4 h-4 flex-shrink-0" /> Propietarios
        </button>
        <button type="button" @click="vistaActiva = 'historial'"
          :class="vistaActiva === 'historial' && 'nav-item-active'" class="nav-item">
          <ClipboardPlus class="w-4 h-4 flex-shrink-0" /> Historial Médico
        </button>
        <button type="button" @click="vistaActiva = 'inventario'"
          :class="vistaActiva === 'inventario' && 'nav-item-active'" class="nav-item">
          <Package class="w-4 h-4 flex-shrink-0" /> Inventario
        </button>
        <button type="button" @click="vistaActiva = 'configuracion'"
          :class="vistaActiva === 'configuracion' && 'nav-item-active'" class="nav-item">
          <Settings2 class="w-4 h-4 flex-shrink-0" /> Configuración
        </button>
      </nav>

      <div class="py-3 border-t border-forest-border">
        <a href="#" class="nav-item">
          <LifeBuoy class="w-4 h-4 flex-shrink-0" /> Soporte
        </a>
        <a href="#" class="nav-item">
          <LogOut class="w-4 h-4 flex-shrink-0" /> Cerrar sesión
        </a>
      </div>
    </aside>

    <!-- ── Active section ── -->
    <PacientesView v-if="vistaActiva === 'pacientes'" @ver-detalle="abrirDetalle" />
    <CitasView v-else-if="vistaActiva === 'citas'" />
    <PropietariosView v-else-if="vistaActiva === 'propietarios'" />
    <HistorialMedicoView v-else-if="vistaActiva === 'historial'" />
    <InventarioView v-else-if="vistaActiva === 'inventario'" />
    <ConfiguracionView v-else-if="vistaActiva === 'configuracion'" />
    <DetalleMascota
      v-else-if="vistaActiva === 'detalle-mascota'"
      :mascota-id="mascotaDetalleId"
      @volver="vistaActiva = 'pacientes'"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Dog, LayoutDashboard, PawPrint, CalendarDays, ClipboardPlus,
  Package, Settings2, LifeBuoy, LogOut, Users,
} from 'lucide-vue-next'
import PacientesView from './components/PacientesView.vue'
import CitasView from './components/CitasView.vue'
import PropietariosView from './components/PropietariosView.vue'
import HistorialMedicoView from './components/HistorialMedicoView.vue'
import InventarioView from './components/InventarioView.vue'
import ConfiguracionView from './components/ConfiguracionView.vue'
import DetalleMascota from './components/DetalleMascota.vue'

const vistaActiva = ref('pacientes')
const mascotaDetalleId = ref(null)

function abrirDetalle(mascota) {
  mascotaDetalleId.value = mascota.id
  vistaActiva.value = 'detalle-mascota'
}
</script>

<style>
@reference "./assets/tailwind.css";

.nav-item {
  @apply flex items-center gap-2.5 px-4 py-2.5 text-sidebar-text text-sm font-medium
         hover:bg-forest-hover hover:text-green-100 transition-colors no-underline
         cursor-pointer border-none bg-transparent w-full text-left;
}
.nav-item-active {
  @apply bg-forest-mid text-white border-l-[3px] border-gold pl-[calc(1rem-3px)];
}
</style>
