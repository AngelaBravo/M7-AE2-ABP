// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqAAvXI43LMZgsVCssgwGXkoDdAt0OZN4",
  authDomain: "pokemonportafolio.firebaseapp.com",
  projectId: "pokemonportafolio",
  storageBucket: "pokemonportafolio.firebasestorage.app",
  messagingSenderId: "821374010193",
  appId: "1:821374010193:web:4082c843051acae9b9c970"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app

