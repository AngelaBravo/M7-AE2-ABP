<template>
  <!-- Componente navbar superior con los menus generales -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-info" v-if="isAuthenticated">
    <div class="container">
      <router-link class="navbar-brand" to="/">Pokédex</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/favorites">Favoritos</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown" v-if="user">
            <span class="navbar-text me-3">
              <i class="bi bi-person-circle me-1"></i>
              {{ user.email }}
            </span>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light btn-sm" @click="handleLogout" :disabled="loading">
              <i class="bi bi-box-arrow-right me-1"></i>
              {{ loading ? 'Cerrando...' : 'Cerrar Sesión' }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { user, isAuthenticated, logout, loading } = useAuth()

const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    router.push('/login')
  }
}
</script>

<style scoped>
.navbar-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

.btn-outline-light {
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
