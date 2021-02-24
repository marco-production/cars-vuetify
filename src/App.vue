<template>
  <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>

      <v-list-item>
        <v-list-item-content>
            <v-row>
              <v-col cols="3">
                <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                transition="scale-transition" width="40" height="40"/>
              </v-col>
              <v-col cols="9">
                <v-list-item-title class="title">Vue Cars</v-list-item-title>
                <v-list-item-subtitle>Marco Antonio</v-list-item-subtitle>
              </v-col>
            </v-row>
        </v-list-item-content>
      </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      
      <v-list-item v-for="item in items" :key="item.title" link :to="item.url">
        
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="black--text">{{ item.title }}</v-list-item-title>
        </v-list-item-content>

      </v-list-item>
      
    </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <h1 class="text-center mb-0">
            {{this.$router.currentRoute['name']}}
          </h1>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <p class="text-center mb-0">Marco Antonio De la cruz Santos - All rights reserved</p>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<style>
.link {
  text-decoration: none;
}
</style>
<script>

export default {
  name: 'App',
  data: () => ({
    drawer: null,
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', url: '/' },
      { title: 'Vehicles', icon: 'mdi-car-hatchback', url: '/vehicles' },
      { title: 'Vehicle Types', icon: 'mdi-train-car', url: '/vehicle-types' },
      { title: 'Makes', icon: 'mdi-google-photos', url: '/makes' },
      { title: 'Models', icon: 'mdi-google-circles-communities', url: '/models' },
      { title: 'Fuels', icon: 'mdi-fuel', url: '/fuels' },
      { title: 'About me', icon: 'mdi-account-tie', url: '/about-me' },
    ],
    right: null,
  }),
  
  /*watch: {
    '$route' (to,from) {
      document.title = to.meta.title || 'Your Website'
    }
  },*/
};
</script>
