<template>
  <article class="card h-100 shadow-sm">
    <img :src="image" class="card-img-top bg-light" :alt="name" style="object-fit:contain; height:150px;">
    <div class="card-body">
      <h5 class="card-title text-capitalize">{{ name }}</h5>
      <div>
        <span v-for="type in types" :key="type" class="badge bg-primary me-1">{{ type }}</span>
      </div>
      <ul class="list-unstyled mt-2 mb-0">
        <li v-for="ability in abilities" :key="ability" class="small">{{ ability }}</li>
      </ul>
    </div>
    <div class="card-footer d-flex justify-content-between align-items-center bg-white border-0">
      <button
        class="btn btn-outline-danger btn-sm d-flex align-items-center"
        @click="$emit('toggle-favorite')"
        :disabled="!removeMode && isFavorite"
        :title="removeMode ? 'Quitar de favoritos' : (isFavorite ? 'Ya en favoritos' : 'Agregar a favoritos')"
      >
        <i :class="['bi', isFavorite ? 'bi-heart-fill' : 'bi-heart', 'me-1']"></i>
        <span v-if="removeMode">Quitar de favoritos</span>
        <span v-else-if="!isFavorite">Agregar a favoritos</span>
        <span v-else>En favoritos</span>
      </button>
      <router-link :to="`/pokemon/${id}`" class="btn btn-outline-success btn-sm">Ver detalle</router-link>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  id: Number,
  name: String,
  image: String,
  types: Array,
  abilities: Array,
  isFavorite: Boolean,
  removeMode: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.card-img-top {
  transition: all 0.3s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-outline-danger:hover {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}

.btn-outline-success:hover {
  background-color: #198754 !important;
  border-color: #198754 !important;
  color: white !important;
}

/* Add a subtle glow effect to favorite button when it's a favorite */
.btn-outline-danger:disabled {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
  opacity: 0.8;
}
</style>
