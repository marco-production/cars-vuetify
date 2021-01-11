import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Vehicle from '../views/Vehicle.vue'
import VehicleType from '../views/VehicleType.vue'
import Make from '../views/Make.vue'
import Model from '../views/Model.vue'
import Fuel from '../views/Fuel.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Home
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: Vehicle
  },
  {
    path: '/vehicle-types',
    name: 'Vehicle types',
    component: VehicleType
  },
  {
    path: '/makes',
    name: 'Makes',
    component: Make
  },
  {
    path: '/models',
    name: 'Models',
    component: Model
  },
  {
    path: '/fuels',
    name: 'Fuels',
    component: Fuel
  },
  {
    path: '/about-me',
    name: 'About me',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
