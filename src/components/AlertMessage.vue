<template>
  <transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 -translate-y-2"
    leave-active-class="transition-all duration-200"
    leave-to-class="opacity-0 -translate-y-2">
    <div v-if="message"
      :class="type === 'success'
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
        : 'bg-red-50 text-red-800 border-red-200'"
      class="flex justify-between items-center px-4 py-3 rounded-xl border mb-4 text-sm font-medium"
      role="alert">
      <span>{{ message }}</span>
      <button @click="$emit('close')" class="ml-4 text-current opacity-60 hover:opacity-100 transition-opacity text-base leading-none">✕</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({ message: { type: String, default: '' }, type: { type: String, default: 'success' } })
defineEmits(['close'])
</script>
