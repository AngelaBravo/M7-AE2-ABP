<template>
  <div class="container py-5">
    <h2 class="mb-4">Pokémon Favoritos</h2>
    <div class="row mb-3">
      <div class="col-md-6">
        <button class="btn btn-outline-secondary me-2" :class="{active: order==='az'}" @click="setOrder('az')">Ordenar A-Z</button>
        <button class="btn btn-outline-secondary" :class="{active: order==='za'}" @click="setOrder('za')">Ordenar Z-A</button>
      </div>
    </div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="paginatedFavorites.length > 0">
        <div class="row row-cols-1 row-cols-md-4 g-4">
          <div v-for="pokemon in paginatedFavorites" :key="pokemon.id" class="col">
            <PokemonCard
              :id="pokemon.id"
              :name="pokemon.name"
              :image="pokemon.image"
              :types="pokemon.types"
              :abilities="pokemon.abilities"
              :isFavorite="true"
              :removeMode="true"
              @toggle-favorite="removeFavorite(pokemon.id)"
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
      <div v-else class="text-center py-5">
        <h4>No tienes pokemones favoritos aún.</h4>
        <router-link to="/" class="btn btn-outline-primary mt-3">Ir al Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import Pagination from '../components/Pagination.vue'

const favoritesIds = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))
const favorites = ref([])
const loading = ref(true)
const order = ref('az')
const currentPage = ref(1)
const pageSize = 10

async function fetchFavorites() {
  loading.value = true
  if (favoritesIds.value.length === 0) {
    favorites.value = []
    loading.value = false
    return
  }
  // Obtener detalles de favoritos
  const details = await Promise.all(
    favoritesIds.value.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()))
  )
  favorites.value = details.map(p => ({
    id: p.id,
    name: p.name,
    image: p.sprites.other['official-artwork'].front_default,
    types: p.types.map(t => t.type.name),
    abilities: p.abilities.map(a => a.ability.name)
  }))
  loading.value = false
}

onMounted(fetchFavorites)

watch(favoritesIds, fetchFavorites)

function removeFavorite(id) {
  const idx = favoritesIds.value.indexOf(id)
  if (idx !== -1) {
    favoritesIds.value.splice(idx, 1)
    localStorage.setItem('favorites', JSON.stringify(favoritesIds.value))
    // Remover del array de favoritos para actualizar la vista inmediatamente
    const favIdx = favorites.value.findIndex(p => p.id === id)
    if (favIdx !== -1) favorites.value.splice(favIdx, 1)
  }
}

function setOrder(val) {
  order.value = val
}

const orderedFavorites = computed(() => {
  let list = [...favorites.value]
  list.sort((a, b) => {
    if (order.value === 'az') return a.name.localeCompare(b.name)
    else return b.name.localeCompare(a.name)
  })
  return list
})

const totalPages = computed(() => Math.ceil(orderedFavorites.value.length / pageSize))

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return orderedFavorites.value.slice(start, start + pageSize)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(order, () => {
  currentPage.value = 1
})
</script>
