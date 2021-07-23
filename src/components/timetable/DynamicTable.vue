<template>
    <List v-if="showList"/>
    <VTable v-else
            :content="package.data"
            :is-loading="package.isLoading"
            :on-more="onMore"
            v-model:selected="_selected"/>
</template>

<script>
import List from "./List";
import VTable from "@/components/timetable/VTable";
import {defineComponent} from "vue";

export default defineComponent({
    name: "DynamicTable",
    components: {VTable, List},
    props: ["package", "onMore", 'selected'],
    data() {
        return {
            showList: false,
            _selected: this.selected
        }
    },
    watch: {
        selected(newSelected) {
            this._selected = newSelected;
        },
        _selected() {
            this.$emit('update:selected', this._selected);
        }
    },
    methods: {
        updateShowList() {
            this.showList = window.innerWidth <= 1024;
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateShowList);
        this.updateShowList();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateShowList);
    }
});
</script>

<style scoped>


</style>
