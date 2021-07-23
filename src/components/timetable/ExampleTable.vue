<template>
    <DynamicTable :package="package"/>
</template>

<script>
import DynamicTable from "./DynamicTable";

export default {
    name: "ExampleTable",
    components: {DynamicTable},
    data() {
        return {
            data: [],
            isLoading: true,
        }
    },
    computed: {
        package() {
            return {
                data: this.data,
                isLoading: this.isLoading,
                error: '',
            }
        }
    },
    async mounted() {
        const response = await fetch('/examples/timetable.json');
        this.data = await response.json();
        this.isLoading = false;
    }
}
</script>

<style scoped>

</style>
