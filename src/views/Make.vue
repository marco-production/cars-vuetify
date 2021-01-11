<template>
    <div>
        <basic-crud name="Make" endpoint="makes"></basic-crud>
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