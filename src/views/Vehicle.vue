<template>
    <div class="vehicle">
        <v-container v-if="newVehicle">
            <div class="text-left">
                <div class="my-2">
                    <v-btn class="ma-2 white--text mb-1" depressed small color="blue-grey" @click="goBack"><v-icon dark>mdi-keyboard-backspace</v-icon> Go back</v-btn>
                </div>
            </div>
              <validation-observer ref="observer">
                <v-alert dense text dismissible v-show="alertError" class="mb-0" type="error">{{alertErrorMessage}}</v-alert>
                <form @submit.prevent="submit" class="mt-5">
                    <v-row>
                        <v-col md="6" cols="12">
                            <validation-provider name="Make" rules="required" v-slot="{errors}">
                                <v-select v-model="vehicle.make" :items="makes" item-text="name" :error-messages="errors" item-value="id" label="Make" @change="getModels"></v-select>
                            </validation-provider>
                            <validation-provider name="year" rules="required|min:4|max:4" v-slot="{errors}">
                                <v-text-field v-model="vehicle.year" type="number" :error-messages="errors" :counter="4" label="Year"></v-text-field>
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
                            <validation-provider rules="image" v-slot="{ errors }">
                                <v-file-input v-model="vehicle.image" ref="file" :error-messages="errors" label="Vehicle image" filled accept="image/*" prepend-icon="mdi-camera"></v-file-input>
                            </validation-provider>
                            <validation-provider name="Description" rules="max:200" v-slot="{errors}">
                                <v-textarea  v-model="vehicle.description" label="Description" :error-messages="errors" hint="Description about vehicle"></v-textarea>
                            </validation-provider>
                        </v-col> 
                        <v-col cols="12" class="text-right">
                            <v-btn class="mr-4" v-show="axiosAction" @click="clear">clear</v-btn>
                            <v-btn class="white--text" color="green" type="submit">{{axiosAction ? 'Create' : 'Update'}}</v-btn>
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
                <v-col sm="12" cols="12" v-show="alertCreated">
                    <v-alert dense text dismissible class="mb-0" type="success">{{alertCreatedMessage}}</v-alert>
                </v-col>
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

                            <v-icon medium class="ml-2 mr-2" @click="removeVehicle(vehicle.id)">mdi-delete</v-icon>
                            <v-icon medium class="mr-2" @click="editVehicle(vehicle)">mdi-pencil</v-icon>
                            <router-link class="text-decoration-none" :to="{ name: 'Vehicles Details', params: { slug: vehicle.slug } }"><v-icon medium>mdi-eye</v-icon></router-link>
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
            <v-dialog v-model="dialogDelete" max-width="525px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this vehicle?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteVehicle">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    ...rules[rule],
    message: messages[rule]
  });
});

// with typescript
for (let [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  })
}

export default {
    data() {
        return {
            apiToken: 'yJsEhmB5HpnuvPMu',
            vehicles:[],
            show: false,
            newVehicle: false,
            dialogDelete: false,
            axiosAction: true,
            makes:[],
            models:[],
            fuels:[],
            vehicleTypes:[],
            alertCreated: false,
            alertError: false,
            alertCreatedMessage: '',
            alertErrorMessage: '',
            deleteVehicleId: 0,
            condition:[{name: 'New', value: 1}, {name: 'Used', value: 0}],
            vehicle: { id: 0, make:'', model:'', year:'', vehicle_type:'', fuel:'', condition: 1, chassis:'', description:'', status: true, image:[] },
            defaultVehicle: { make:'', model:'', year:'', vehicle_type:'', fuel:'', condition: 1, chassis:'', description:'', status: true, image:[] },
        }
    },

    components: {
        ValidationProvider,
        ValidationObserver
    },

    watch: {
        dialogDelete (val) {
        val || this.closeDelete()
        },
    },

    created(){
        this.getVehicles()
        this.getMakes()
        this.getFuels()
        this.getVehicleTypes()
    },

    methods: {
        getVehicles(){
            axios.get(`${this.$apiUrl}/vehicles`, {headers: {'api_token': this.apiToken }})
            .then((res)=>{
                this.vehicles = res.data
            })
        },

        getMakes(){
            axios.get(`${this.$apiUrl}/makes`, {headers: {'api_token': this.apiToken }})
            .then((res)=>{
                this.makes = res.data
            })
        },

        getModels(event){
            axios.get(`${this.$apiUrl}/models/${this.vehicle.make}`, {headers: {'api_token': this.apiToken }})
            .then((res)=>{
                if(event) this.vehicle.model = ''
                this.models = res.data
            })
        },

        getFuels(){
            axios.get(`${this.$apiUrl}/fuels`, {headers: {'api_token': this.apiToken }})
            .then((res)=>{
                this.fuels = res.data
            })
        },

        getVehicleTypes(){
            axios.get(`${this.$apiUrl}/vehicletypes`, {headers: {'api_token': this.apiToken }})
            .then((res)=>{
                this.vehicleTypes = res.data
            })
        },

        createVehicle() {
            let params = {
                make_id: this.vehicle.make, 
                model_id: this.vehicle.model,
                fuel_id: this.vehicle.fuel, 
                vehicle_type_id: this.vehicle.vehicle_type,
                year: this.vehicle.year, 
                chassis: this.vehicle.chassis,
                condition: this.vehicle.condition, 
                description: this.vehicle.description,
                status: this.vehicle.status ? 1 : 0}

            const formData = new FormData()
            Object.entries(params).forEach((val) => {
                formData.append(val[0], val[1])
            })

            formData.append('image', this.vehicle.image)

            axios.post(`${this.$apiUrl}/vehicles`, formData, {headers: {'Content-Type': 'multipart/form-data', 'api_token': this.apiToken }})
            .then((res)=>{
                this.vehicles.splice(0,0,res.data)
                this.alertCreatedMessage = 'The vehicle was created successfully.'
                this.alertCreated = true
                this.newVehicle = false
                this.alertError = false
            })
            .catch((err)=>{
                this.alertErrorMessage = err
                this.alertError = true
            })
        },

        updateVehicle(){
            let params = {
                make_id: this.vehicle.make, 
                model_id: this.vehicle.model,
                fuel_id: this.vehicle.fuel, 
                vehicle_type_id: this.vehicle.vehicle_type,
                year: this.vehicle.year, 
                chassis: this.vehicle.chassis,
                condition: this.vehicle.condition, 
                description: this.vehicle.description,
                status: this.vehicle.status ? 1 : 0}

            const formData = new FormData()
            Object.entries(params).forEach((val) => {
                formData.append(val[0], val[1])
            })

            formData.append('image', this.vehicle.image)

            axios.post(`${this.$apiUrl}/vehicles/${this.vehicle.id}`, formData, {headers: {'Content-Type': 'multipart/form-data', 'api_token': this.apiToken }})
            .then((res)=>{
                let index = this.vehicles.findIndex(vehicle => vehicle.id == res.data.id)
                Object.assign(this.vehicles[index], res.data)
                this.alertError = false
                this.$router.push({ name: "Vehicles Details", params: { slug: res.data.slug }})
            })
            .catch((err)=>{
                this.alertErrorMessage = err
                this.alertError = true
            })
        },

        deleteVehicle(){
            axios.delete(`${this.$apiUrl}/vehicles/${this.deleteVehicleId}`, {headers: {'api_token': this.apiToken }})
            .then(() => {
                let index = this.vehicles.findIndex(vehicle => vehicle.id == this.deleteVehicleId)
                this.vehicles.splice(index,1)
                this.closeDelete()
                this.alertCreatedMessage = 'The vehicle was deleted successfully.'
                this.alertCreated = true
            })
            .catch((err) => {
                console.log(err)
            })
        },

        goBack(){
            this.newVehicle = false
            this.axiosAction = true
            this.alertError = false
            this.vehicle = Object.assign({}, this.defaultVehicle)
        },

        editVehicle(vehicle){
            let obj = { id: vehicle.id, make: vehicle.make_id, model: vehicle.model_id, year: vehicle.year, vehicle_type: vehicle.vehicle_type_id, fuel: vehicle.fuel_id, condition: vehicle.condition, chassis: vehicle.chassis, description: vehicle.description, status: vehicle.status == 1 ? true : false }
            Object.assign(this.vehicle, obj)
            this.getModels()
            this.axiosAction = false
            this.newVehicle = true
        },

        removeVehicle(id){
            this.deleteVehicleId = id
            this.dialogDelete = true
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.deleteVehicleId = 0
            })
        },

        async submit(){
            const isValid = await this.$refs.observer.validate()
            if(isValid){
                if (this.axiosAction) {
                    this.createVehicle()
                } else {
                    this.updateVehicle()
                }
            }
        },
        clear () {
            this.$refs.observer.reset()
            return;
        },
    },
}
</script>
<style>
    .text-decoration-none{
        text-decoration: none;
    }
</style>