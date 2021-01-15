import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Vehicle from '../views/Vehicle.vue'
import VehicleDetails from '../views/VehicleDetails.vue'
import VehicleType from '../views/VehicleType.vue'
import Make from '../views/Make.vue'
import Model from '../views/Model.vue'
import Fuel from '../views/Fuel.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    meta:{
      title: 'Vue Cars',
    },
    component: Home
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    meta:{
      title: 'Vue Cars | Vehicles',
    },
    component: Vehicle
  },
  {
    path: '/vehicles/:slug',
    name: 'Vehicles Details',
    meta:{
      title: 'Vue Cars | Vehicles',
    },
    params: true,
    component: VehicleDetails
  },
  {
    path: '/vehicle-types',
    name: 'Vehicle types',
    meta:{
      title: 'Vue Cars | Vehicle types',
    },
    component: VehicleType
  },
  {
    path: '/makes',
    name: 'Makes',
    meta:{
      title: 'Vue Cars | Makes',
    },
    component: Make
  },
  {
    path: '/models',
    name: 'Models',
    meta:{
      title: 'Vue Cars | Models',
    },
    component: Model
  },
  {
    path: '/fuels',
    name: 'Fuels',
    meta:{
      title: 'Vue Cars | Fuels',
    },
    component: Fuel
  },
  {
    path: '/about-me',
    name: 'About me',
    meta:{
      title: 'Vue Cars | About me',
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//Para agregar metatags.
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
