<template>
    <div class="timetable">
        <DynamicTable/>
    </div>
</template>

<script>
import Alert from "@/components/controls/Alerts/Alert";
import DynamicTable from "@/components/timetable/DynamicTable";
import {mapState} from "vuex";
export default {
    name: "Timetable",
    components: {DynamicTable, Alert},
    computed: {
        ...mapState('timetable', ['timetable', 'isLoading', 'error'])
    },
    methods: {
        async refreshTimetable() {
            await this.$store.dispatch('timetable/fetchTimetable', { date: '21/09/2021'});
        }
    },
    mounted() {
        this.refreshTimetable();
    }
}
</script>

<style lang="less" scoped>

.timetable {
    margin: 0 auto;
    padding: 2rem 2rem;
    width: 70%;
}

@media screen and (max-width: 1024px) {
    .timetable {
        width: 95%;
    }
}

</style>
