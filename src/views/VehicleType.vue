<template>
    <div>
        <basic-crud name="Vehicle Type" endpoint="vehicletypes"></basic-crud>
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