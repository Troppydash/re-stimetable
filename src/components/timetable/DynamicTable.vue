<template>
    <List v-if="showList"/>
    <VTable v-else
            :content="package.data"
            :is-loading="package.isLoading"
            :on-more="onMore"
            :on-select="onSelect"/>
</template>

<script>
import List from "./List";
import VTable from "@/components/timetable/VTable";
import {defineComponent} from "vue";

export default defineComponent({
    name: "DynamicTable",
    components: {VTable, List},
    props: ["package", "onMore", "onSelect"],
    data() {
        return {
            showList: false
        }
    },
    methods: {
        updateShowList() {
            this.showList = window.innerWidth <= 1024;
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateShowList);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateShowList);
    }
});
</script>

<style scoped>


</style>
