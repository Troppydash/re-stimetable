<template>
    <div class="timetable">
<br/>
<br/>
        <DynamicTable :package="package" :on-more="fetchMore"/>
    </div>
</template>

<script>
import Alert from "@/components/controls/Alerts/Alert";
import DynamicTable from "@/components/timetable/DynamicTable";
import {mapState} from "vuex";
import {DateParser} from "@/lib/dates/dateParser";

export default {
    name: "Timetable",
    components: {DynamicTable, Alert},
    computed: {
        ...mapState('timetable', ['timetable', 'isLoading', 'error']),
        package() {
            return {
                isLoading: this.isLoading,
                data: this.timetable,
                error: this.error
            };
        }
    },
    methods: {
        async refreshTimetable() {
            await this.$store.dispatch('timetable/fetchTimetable', {date: DateParser.TodayForRequest()});
        },
        async fetchMore() {
            const lastDate = DateParser.AddDays(this.timetable[this.timetable.length-1].Date, DateParser.TT_FORMAT, 7, DateParser.REQUEST_FORMAT);
            await this.$store.dispatch('timetable/fetchMoreTimetable', {date: lastDate});
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
    width: 90%;
}

@media screen and (max-width: 1024px) {
    .timetable {
        width: 95%;
    }
}

</style>
