<template>

</template>

<script>
export default {
    name: "Settings",
    mounted() {
        this.$shadow.evoke("showAlert", "Hello World");
    }
}
</script>

<style scoped>

</style>
