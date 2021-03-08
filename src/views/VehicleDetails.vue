<template>
    <div>
        <v-container>
            <v-row justify="space-around">
                <v-col md="6" cols="12">
                    <v-img
                        :src="vehicle.image"
                        aspect-ratio="2"
                        contain
                    ></v-img>
                </v-col>
                <v-col md="6" cols="12">
                    <h2 class="mb-3 text-decoration-underline">{{ vehicle.make.name }} {{ vehicle.model.name }} {{ vehicle.year }}</h2>
                    <p><span class="font-weight-bold">Vehicle Type:</span> {{ vehicle.vehicle_type.name }}</p>
                    <p><span class="font-weight-bold">Fuel:</span> {{ vehicle.fuel.name }}</p>
                    <p><span class="font-weight-bold">Chassis:</span> {{ vehicle.chassis }}</p>
                    <p><span class="font-weight-bold">Condition:</span> {{ vehicle.condition == 1 ? 'New' : 'Used' }}</p>
                    <p><span class="font-weight-bold">Description:</span> {{ vehicle.description }}</p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            slug: this.$route.params.slug,
            apiToken: 'yJsEhmB5HpnuvPMu',
            vehicle: []
        }
    },

    created(){
        this.getVehicle()
    },

    methods:{
        getVehicle(){
            axios.get(`${this.$apiUrl}/vehicles/${this.slug}`, {headers: {'api_token': this.apiToken }})
            .then((vehicle)=>{
                this.vehicle = vehicle.data
            })
        }
    }
}
</script>