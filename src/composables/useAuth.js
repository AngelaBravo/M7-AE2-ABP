import { ref, onMounted, computed } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.js'

// Global authentication state
const user = ref(null)
const loading = ref(true)

// Initialize auth state listener
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  loading.value = false
})

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (email, password) => {
    try {
      loading.value = true
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { 
        success: false, 
        error: 'Error al cerrar sesión' 
      }
    }
  }

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado'
      case 'auth/wrong-password':
        return 'Contraseña incorrecta'
      case 'auth/invalid-email':
        return 'Email inválido'
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intente más tarde'
      case 'auth/invalid-credential':
        return 'Credenciales inválidas'
      default:
        return 'Error de autenticación'
    }
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    login,
    logout
  }
}