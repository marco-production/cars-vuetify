<template>
    <div class="vehicle">
        <v-container v-if="newVehicle">
            <div class="text-left">
                <div class="my-2">
                    <v-btn class="ma-2 white--text mb-1" depressed small color="blue-grey" @click="newVehicle = false"><v-icon dark>mdi-keyboard-backspace</v-icon> Go back</v-btn>
                </div>
            </div>
              <validation-observer ref="observer">
                <form @submit.prevent="submit" class="mt-5">
                    <v-row>
                        <v-col md="6" cols="12">
                            <validation-provider name="Make" rules="required" v-slot="{errors}">
                                <v-select v-model="vehicle.make" :items="makes" item-text="name" :error-messages="errors" item-value="id" label="Make" @change="getModels"></v-select>
                            </validation-provider>
                            <validation-provider name="year" rules="required" v-slot="{errors}">
                                <v-text-field v-model="vehicle.year" :error-messages="errors" :counter="4" label="Year"></v-text-field>
                            </validation-provider>
                            <validation-provider name="fuel" rules="required" v-slot="{errors}">
                                <v-select v-model="vehicle.fuel" :error-messages="errors" item-text="name" item-value="id" :items="fuels" label="Fuel"></v-select>
                            </validation-provider>
                            <v-text-field v-model="vehicle.chassis" label="Chassis"></v-text-field>
                        </v-col>
                        <v-col md="6" cols="12">
                            <validation-provider name="model" rules="required" v-slot="{errors}">
                                <v-select v-model="vehicle.model" :items="models" item-text="name" :error-messages="errors" item-value="id" label="Model"></v-select>
                            </validation-provider>
                            <validation-provider name="vehicle type" rules="required" v-slot="{errors}">
                                <v-select v-model="vehicle.vehicle_type" :error-messages="errors" :items="vehicleTypes" item-text="name" item-value="id" label="Vehicle Type"></v-select>
                            </validation-provider>
                            <v-select v-model="vehicle.condition" :items="condition" item-text="name" item-value="value" label="Condition"></v-select>
                            <v-checkbox v-model="vehicle.status" label="Status of vehicle"></v-checkbox>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input v-model="vehicle.image" label="Vehicle image" filled accept="image/*" prepend-icon="mdi-camera"></v-file-input>
                            <v-textarea  v-model="vehicle.description" label="Description" hint="Description about vehicle"></v-textarea>
                        </v-col> 
                        <v-col cols="12" class="text-right">
                            <v-btn class="mr-4" @click="clear">clear</v-btn>
                            <v-btn class="white--text" color="green" type="submit">Create</v-btn>
                        </v-col>
                    </v-row>
                </form>
            </validation-observer>
        </v-container>
        <v-container v-else>
            <div class="text-left">
                <div class="my-2">
                    <v-btn class="ma-2 white--text" @click="newVehicle = true" depressed large color="blue-grey"><v-icon dark>mdi-plus</v-icon> Add Vehicle</v-btn>
                </div>
            </div>
            <v-row>
                <v-col sm="4" cols="12" v-for="vehicle in vehicles" :key="vehicle.id">
                    <v-card class="mt-5" max-width="344">
                        <v-img :src="vehicle.image" height="200px"></v-img>
                        <v-card-title>{{vehicle.make.name}} {{vehicle.model.name}} {{vehicle.year}}</v-card-title>
                        <v-card-subtitle>{{vehicle.vehicle_type.name}} | {{vehicle.fuel.name}} | {{vehicle.condition == 1 ? 'New' : 'Used'}}</v-card-subtitle>

                        <v-card-actions>
                            <v-btn icon @click="show = !show" v-if="vehicle.description">
                                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-icon medium class="ml-2 mr-2">mdi-delete</v-icon>
                            <v-icon medium class="mr-2" @click="editVehicle(vehicle)">mdi-pencil</v-icon>
                            <v-icon medium>mdi-eye</v-icon>
                        </v-card-actions>

                        <v-expand-transition v-if="vehicle.description">
                            <div v-show="show">
                                <v-divider></v-divider>
                                <v-card-text>{{vehicle.description}}</v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

Object.keys(rules).forEach(rule => {
    extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});

// with typescript
for (let [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  });
}

export default {
    data() {
        return {
            apiToken: 'yJsEhmB5HpnuvPMu',
            vehicles:[],
            show: false,
            newVehicle: false,
            vehicleIndex: -1,

            vehicle:{ make:'', model:'', year:'', vehicle_type:'', fuel:'', condition: true, chassis:'', description:'', status: true, image:[] },
            makes:[],
            models:[],
            fuels:[],
            vehicleTypes:[],
            condition:[{name: 'New', value: 1}, {name: 'Used', value: 0}],
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
        }
    },
    components: {
        ValidationProvider,
        ValidationObserver
    },
    created(){
        this.getVehicles();
        this.getMakes();
        this.getFuels();
        this.getVehicleTypes();
    },
    methods: {
        getVehicles(){
            axios.get(`${this.$apiUrl}/vehicles?api_token=${this.apiToken}`)
            .then((res)=>{
                this.vehicles = res.data;
                console.log(this.vehicles);
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        getMakes(){
            axios.get(`${this.$apiUrl}/makes?api_token=${this.apiToken}`)
            .then((res)=>{
                this.makes = res.data;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        getModels(){
            axios.get(`${this.$apiUrl}/models?api_token=${this.apiToken}&make=${this.vehicle.make}`)
            .then((res)=>{
                this.models = res.data;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        getFuels(){
            axios.get(`${this.$apiUrl}/fuels?api_token=${this.apiToken}`)
            .then((res)=>{
                this.fuels = res.data;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        getVehicleTypes(){
            axios.get(`${this.$apiUrl}/vehicletypes?api_token=${this.apiToken}`)
            .then((res)=>{
                this.vehicleTypes = res.data;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        createVehicle() {

            console.log(this.vehicle.image);
            let fd= new FormData();
            fd.append('image', this.vehicle.image);

            let params = {
                make_id: this.vehicle.make, 
                model_id: this.vehicle.model,
                fuel_id: this.vehicle.fuel, 
                vehicle_type_id: this.vehicle.vehicle_type,
                year: this.vehicle.year, 
                chassis: this.vehicle.chassis,
                condition: this.vehicle.condition, 
                description: this.vehicle.description,
                status: this.vehicle.status,
                //image: this.vehicle.image, 
            };

            fd.append();

            //const headers = {headers: {'Content-Type': 'multipart/form-data' }};

            axios.post(`${this.$apiUrl}/vehicles?api_token=${this.apiToken}`,params/* , headers */)
            .then((res)=>{
                this.vehicles.splice(0,0,res.data);
                //console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        updateVehicle(){

        },

        editVehicle(vehicle){
            console.log(vehicle);
        },

        async submit(){
            const isValid = await this.$refs.observer.validate();
            if(isValid){
                if (this.vehicleIndex > -1) {
                    this.updateVehicle();
                } else {
                    this.createVehicle();
                }
            }
        },
        clear () {
            this.$refs.observer.reset();
            return;
        },
    },
}
</script>
<style>
.v-application .primary--text{
    color: #4448ee !important;
    caret-color: #444bee !important;
}
</style>