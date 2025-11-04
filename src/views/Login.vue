<template>
  <div class="login-container">
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="card-title mb-2">Pokédex</h2>
                <p class="text-muted">Iniciar Sesión</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    :class="{ 'is-invalid': emailError }"
                    placeholder="Ingrese su email"
                    required
                  >
                  <div v-if="emailError" class="invalid-feedback">
                    {{ emailError }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    :class="{ 'is-invalid': passwordError }"
                    placeholder="Ingrese su contraseña"
                    required
                  >
                  <div v-if="passwordError" class="invalid-feedback">
                    {{ passwordError }}
                  </div>
                </div>

                <div v-if="loginError" class="alert alert-danger" role="alert">
                  {{ loginError }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login, loading: authLoading } = useAuth()

// Form data
const email = ref('')
const password = ref('')
const loginError = ref('')

// Form validation
const emailError = computed(() => {
  if (!email.value) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value) ? '' : 'Email inválido'
})

const passwordError = computed(() => {
  if (!password.value) return ''
  return password.value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres'
})

const loading = computed(() => authLoading.value)

const handleLogin = async () => {
  // Clear previous errors
  loginError.value = ''
  
  // Validate form
  if (emailError.value || passwordError.value || !email.value || !password.value) {
    loginError.value = 'Por favor, complete todos los campos correctamente'
    return
  }

  // Attempt login
  const result = await login(email.value, password.value)
  
  if (result.success) {
    // Redirect to intended page or home
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } else {
    loginError.value = result.error
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: 1;
}

.container-fluid {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 0 15px;
}

.card {
  border: none;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  width: 100%;
  max-width: 400px;
  min-width: 320px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.form-control {
  border-radius: 8px;
  border: 2px solid #e9ecef;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.card-title {
  color: #333;
  font-weight: 700;
}

.text-muted {
  color: #6c757d !important;
}
</style>