<template>
    <div>
        <h1>{{ $route.params.slug }}</h1>
        <h2>{{slug}}</h2>
    </div>
</template>
<script>
export default {
    data() {
        return {
            slug: this.$route.params.slug
        }
    },
}
</script>