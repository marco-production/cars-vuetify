<template>
    <div>
        <basic-crud name="Fuel" endpoint="fuels"></basic-crud>
    </div>
</template>
<script>
import BasicCrud from '@/components/BasicCrud.vue'

export default {
    data() {
        return {
            
        }
    },
    components:{
        BasicCrud
    }
}
</script>