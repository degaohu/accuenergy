import { createRouter, createWebHashHistory } from 'vue-router'
import Homepage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Homepage
  }
]





const router = createRouter({
  history: createWebHashHistory(),
  //mode:"hash",
  base: process.env.BASE_URL,
  routes
})

export default router
