<template>
  <div class="home">
  <v-container>
    <v-row>
      <v-col v-for="page in pages" :key="page.title" sm="4" cols="12">
        <v-card :color="page.color" dark>
          <v-card-title class="headline">
            {{page.title}} <v-icon class="ml-2">{{ page.icon }}</v-icon>
          </v-card-title>

          <v-card-subtitle>{{page.description}}</v-card-subtitle>

          <v-card-actions>
            <router-link class="link" :to="page.url">
            <v-btn text>Go to page</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
<!--   <app-Layout pageTitle="Vehicles"></app-Layout>
 -->      <!-- <v-row align="center" justify="center">
          <v-col cols="12">
              <h1>OUCRAN</h1>
          </v-col>
      </v-row> -->
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      pageTitle:'Dashboard',
      pages:[
        {title: 'Vehicles', description:'List of vehicles registered.', icon: 'mdi-car-hatchback', color: '#385F73', url:'/vehicles'},
        {title: 'Vehicle types', description:'Create categories of motor vehicles.', icon: 'mdi-train-car', color: '#3b3873', url:'/vehicle-types'},
        {title: 'Makes', description:'Register different makes of vehicles.', icon: 'mdi-google-photos', color: '#477338', url:'/makes'},
        {title: 'Models', description:'Create models of a vehicle make.', icon: 'mdi-google-circles-communities', color: '#673873', url:'/models'},
        {title: 'Fuels', description:'Register different fuels of vehicles.', icon: 'mdi-fuel', color: '#733838', url:'/fuels'},
        {title: 'About me', description:'Learn more about me.', icon: 'mdi-account-tie', color: '#38735d', url:'/about-me'},
      ]
    }
  },
}
</script>
