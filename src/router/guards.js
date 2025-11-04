import { useAuth } from '../composables/useAuth.js'

export function requireAuth(to, from, next) {
  const { isAuthenticated, loading } = useAuth()
  
  // Wait for auth state to be determined
  if (loading.value) {
    // Show loading or wait for auth state
    const unsubscribe = loading.value.$watch(
      () => loading.value,
      (newValue) => {
        if (!newValue) {
          unsubscribe()
          if (isAuthenticated.value) {
            next()
          } else {
            next({ name: 'login', query: { redirect: to.fullPath } })
          }
        }
      }
    )
    return
  }
  
  if (isAuthenticated.value) {
    next()
  } else {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
}

export function requireGuest(to, from, next) {
  const { isAuthenticated, loading } = useAuth()
  
  // Wait for auth state to be determined
  if (loading.value) {
    const unsubscribe = loading.value.$watch(
      () => loading.value,
      (newValue) => {
        if (!newValue) {
          unsubscribe()
          if (!isAuthenticated.value) {
            next()
          } else {
            next({ name: 'home' })
          }
        }
      }
    )
    return
  }
  
  if (!isAuthenticated.value) {
    next()
  } else {
    next({ name: 'home' })
  }
}