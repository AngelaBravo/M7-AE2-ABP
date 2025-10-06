import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import PokemonDetail from '../views/PokemonDetail.vue'
import Favorites from '../views/Favorites.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: PokemonDetail,
      props: true,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: Favorites,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

export default router
