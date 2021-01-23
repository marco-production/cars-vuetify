<template>
   <div>
    <v-alert dense text dismissible v-show="alertActive" :type="alertStatus">{{alertMessage}}</v-alert>
    <!-- sort-by="id" -->
    <v-data-table :headers="headers" :items="items" class="elevation-1 mt-4">
      <template v-slot:[`item.created_at`]="{ item }">
          <span>{{new Date(item.created_at).toLocaleString()}}</span>
      </template>
      <template v-slot:[`item.updated_at`]="{ item }">
          <span>{{new Date(item.updated_at).toLocaleString()}}</span>
      </template>    
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{name}}s List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog  v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> New {{name}} </v-btn>
            </template>
            <validation-observer ref="observer">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                          <validation-provider name="name" rules="required" v-slot="{errors}">
                            <v-text-field v-model="editedItem.name" :error-messages="errors" label="Name"></v-text-field>
                          </validation-provider>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </validation-observer>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="520px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this {{name}}?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItem">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="removeItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getItems">Reset</v-btn>
      </template>
    </v-data-table>
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

for (let [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  });
}

export default {
  name: 'BasicCrud',
  
  data: () => ({
    apiToken: 'yJsEhmB5HpnuvPMu',
    dialog: false,
    dialogDelete: false,
    alertActive: false,
    alertStatus: 'success',
    alertMessage: '',
    headers: [
      { text: 'Id', value: 'id', align: 'start'},
      { text: 'Name', sortable: false, value: 'name'},
      { text: 'Created', value: 'created_at' },
      { text: 'Updated', value: 'updated_at' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    items:[],
    editedIndex: -1,
    editedItem: { id: 0, name: ''},
    defaultItem: { id: 0, name: ''},
  }),

  props:['name', 'endpoint'],

  components: {
    ValidationProvider,
    ValidationObserver,
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? `New ${this.name}` : `Edit ${this.name}`
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.getItems();
  },

  methods: {
    getItems(){
      axios.get(`${this.$apiUrl}/${this.endpoint}`, {headers: {'api_token': this.apiToken }})
      .then((res)=>{
        this.items = res.data
      })
    },

    createItem(){
      let params = {name: this.editedItem.name}

      axios.post(`${this.$apiUrl}/${this.endpoint}`, params, {headers: {'api_token': this.apiToken }})
      .then((res)=>{
        this.items.push(res.data)
        this.showAlert('success',`The ${this.name} was created successfully.`)
      })
      .catch((err)=>{
        this.showAlert('error',err.response.data.name[0])
      });
    },

    updateItem(){
      let params = {name: this.editedItem.name}

      axios.put(`${this.$apiUrl}/${this.endpoint}/${this.editedItem.id}`, params, {headers: {'api_token': this.apiToken }})
      .then((res)=>{
        let index = this.items.findIndex(item => item.id == res.data.id)
        Object.assign(this.items[index], res.data)
        this.showAlert('success',`The ${this.name} with id #${res.data.id} was updated.`)
      })
      .catch(()=>{
        this.showAlert('error','The name has already been taken.')
      })
    },

    deleteItem(){
      axios.delete(`${this.$apiUrl}/${this.endpoint}/${this.editedItem.id}`, {headers: {'api_token': this.apiToken }})
      .then(()=>{
        this.items.splice(this.editedIndex, 1)
        this.closeDelete()
        this.showAlert('success',`The ${this.name} has been removed.`)
      })
      .catch((err)=>{
        this.showAlert('error',err)
      })
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    removeItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    showAlert(status, message){
        this.alertStatus = status
        this.alertMessage = message
        this.alertActive = true
    },

    async save () {
      const isValid = await this.$refs.observer.validate()

      if(isValid){
        if (this.editedIndex > -1) {
          await this.updateItem()
        } else {
          await this.createItem()
        }
        this.close()
      }
    }
  },
}
</script>