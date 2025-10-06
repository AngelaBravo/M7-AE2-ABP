
<template>
  <div class="container py-5">
    <h2 class="mb-4">Pokédex</h2>
    <form class="row g-3 mb-4">
      <div class="col-md-4">
        <input v-model="search" type="text" class="form-control" placeholder="Buscar por nombre...">
      </div>
      <div class="col-md-3">
        <select v-model="selectedType" class="form-select">
          <option value="">Filtrar por tipo</option>
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedAbility" class="form-select">
          <option value="">Filtrar por habilidad</option>
          <option v-for="ability in abilities" :key="ability" :value="ability">{{ ability }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <button type="button" class="btn btn-secondary w-100" @click="resetFilters">Limpiar</button>
      </div>
    </form>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="showAlert" class="alert alert-success alert-dismissible fade show" role="alert">
        ¡Pokémon agregado a favoritos!
        <button type="button" class="btn-close" @click="showAlert = false" aria-label="Close"></button>
      </div>
      <div class="row row-cols-1 row-cols-md-4 g-4">
        <div v-for="pokemon in paginatedPokemons" :key="pokemon.id" class="col">
          <PokemonCard
            :id="pokemon.id"
            :name="pokemon.name"
            :image="pokemon.image"
            :types="pokemon.types"
            :abilities="pokemon.abilities"
            :isFavorite="favorites.includes(pokemon.id)"
            @toggle-favorite="toggleFavorite(pokemon.id)"
          />
        </div>
      </div>
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @change="goToPage"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import Pagination from '../components/Pagination.vue'


const pokemons = ref([])
const loading = ref(true)
const types = ref([])
const abilities = ref([])
const search = ref('')
const selectedType = ref('')
const selectedAbility = ref('')
const currentPage = ref(1)
const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))
const showAlert = ref(false)

const pageSize = 20

const fetchPokemons = async () => {
  loading.value = true
  // Obtener los primeros 200 pokemones para paginar y filtrar
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200')
  const data = await res.json()
  const results = data.results
  // Obtener detalles de cada pokemon (paralelo)
  const details = await Promise.all(results.map(p => fetch(p.url).then(r => r.json())))
  pokemons.value = details.map(p => ({
    id: p.id,
    name: p.name,
    image: p.sprites.other['official-artwork'].front_default,
    types: p.types.map(t => t.type.name),
    abilities: p.abilities.map(a => a.ability.name)
  }))
  loading.value = false
}

const fetchTypes = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/type')
  const data = await res.json()
  types.value = data.results.map(t => t.name)
}

const fetchAbilities = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/ability?limit=1000')
  const data = await res.json()
  abilities.value = data.results.map(a => a.name)
}

onMounted(() => {
  fetchPokemons()
  fetchTypes()
  fetchAbilities()
})

const filteredPokemons = computed(() => {
  let list = pokemons.value
  if (search.value) {
    list = list.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
  }
  if (selectedType.value) {
    list = list.filter(p => p.types.includes(selectedType.value))
  }
  if (selectedAbility.value) {
    list = list.filter(p => p.abilities.includes(selectedAbility.value))
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredPokemons.value.length / pageSize))

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPokemons.value.slice(start, start + pageSize)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function resetFilters() {
  search.value = ''
  selectedType.value = ''
  selectedAbility.value = ''
  currentPage.value = 1
}

function toggleFavorite(id) {
  const idx = favorites.value.indexOf(id)
  if (idx === -1) {
    favorites.value.push(id)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
    showAlert.value = true
    setTimeout(() => { showAlert.value = false }, 1500)
  } else {
    favorites.value.splice(idx, 1)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }
}

watch([search, selectedType, selectedAbility], () => {
  currentPage.value = 1
})
</script>
