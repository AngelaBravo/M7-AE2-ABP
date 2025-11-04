<template>
  <!-- Vista con la página de detalle de un pokemon -->
  <article class="container py-5" v-if="!loading && pokemon">
    <div class="row align-items-center">
      <div class="col-md-4 text-center mb-4 mb-md-0">
        <img :src="pokemon.image" :alt="pokemon.name" class="img-fluid" style="max-width: 250px;">
      </div>
      <div class="col-md-8">
        <h2 class="text-capitalize">{{ pokemon.name }}</h2>
        <div class="mb-2">
          <span v-for="type in pokemon.types" :key="type" class="badge bg-primary me-1">{{ type }}</span>
        </div>
        <p><strong>ID:</strong> {{ pokemon.id }}</p>
        <p><strong>Altura:</strong> {{ pokemon.height / 10 }} m</p>
        <p><strong>Peso:</strong> {{ pokemon.weight / 10 }} kg</p>
        <p><strong>Habilidades:</strong>
          <span v-for="ability in pokemon.abilities" :key="ability" class="badge bg-secondary me-1">{{ ability }}</span>
        </p>
        <p><strong>Stats:</strong></p>
        <ul>
          <li v-for="stat in pokemon.stats" :key="stat.name">
            {{ stat.name }}: {{ stat.value }}
          </li>
        </ul>
        <router-link to="/" class="btn btn-outline-primary mt-3">Volver</router-link>
      </div>
    </div>
  </article>
  <article v-else-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </article>
  <article v-else class="container py-5 text-center">
    <h3>No se encontró el Pokémon</h3>
    <router-link to="/" class="btn btn-outline-primary mt-3">Volver</router-link>
  </article>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pokemon = ref(null)
const loading = ref(true)

async function fetchPokemon(id) {
  loading.value = true
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    if (!res.ok) throw new Error('No encontrado')
    const data = await res.json()
    pokemon.value = {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default,
      types: data.types.map(t => t.type.name),
      abilities: data.abilities.map(a => a.ability.name),
      height: data.height,
      weight: data.weight,
      stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat }))
    }
  } catch (e) {
    pokemon.value = null
  }
  loading.value = false
}

onMounted(() => {
  fetchPokemon(route.params.id)
})

watch(() => route.params.id, (newId) => {
  fetchPokemon(newId)
})
</script>

<style scoped>
.container {
  background-color: rgba(231, 255, 216, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333 !important;
}

.container h2, 
.container p, 
.container strong, 
.container li {
  color: #333 !important;
}

.container h3 {
  color: #333 !important;
}

/* Ensure text is readable */
.text-capitalize {
  color: #333 !important;
}
</style>
