<template>
  <!-- Componente de navegación paginada -->
  <nav>
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="$emit('change', currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
      </li>
      <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
        <button class="page-link" @click="$emit('change', page)">{{ page }}</button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="$emit('change', currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  totalPages: Number
})
</script>
