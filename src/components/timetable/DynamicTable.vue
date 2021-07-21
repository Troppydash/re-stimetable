<template>
    <List v-if="showList"/>
    <Table v-else/>
</template>

<script>
import Table from "./Table";
import List from "./List";

export default {
    name: "DynamicTable",
    components: {List, Table},
    data() {
        return {
            showList: false
        }
    },
    methods: {
        updateShowList() {
            this.showList = window.innerWidth <= 1024;
        }
    },
    mounted() {
        window.addEventListener('resize', this.updateShowList);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateShowList);
    }
}
</script>

<style scoped>


</style>
