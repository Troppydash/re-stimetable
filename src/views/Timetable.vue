<template>
    <div class="timetable">
        <!-- Querying -->
        <div class="timetable__filter">
            <Filterer v-model:filter="filter" :today="today"/>
        </div>

        <!-- Timetable -->
        <div class="timetable__table">
            <DynamicTable :package="package"
                          :on-more="fetchMore"
                          :on-select="handleSelect"/>
        </div>

        <!-- Map -->
        <div :class="{'timetable__map': !fs}">
            <MapCanvas :is-minimized="true"
                       v-model:fs="fs"
                       v-model:closed="closed"
                       v-model:selected="selectedRoom"/>
            <div class="timetable__open-map" v-show="closed">
                <button @click="openMap"
                        class="st-fab">
                    <i class="ri-map-2-line"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "vuex";
import {DateParser} from "@/lib/dates/dateParser";
import DynamicTable from "@/components/timetable/DynamicTable.vue";
import Alert from "@/components/controls/Alerts/Alert.vue";
import MapCanvas from "@/components/map/MapCanvas.vue";
import {TimetableDay, WebTimetablePeriod} from "@/lib/data/timetable";
import {WebSettings} from "@/lib/settings";
import Filterer from "@/components/controls/Filter/Filterer.vue";

export default defineComponent({
    name: "Timetable",
    components: {Filterer, MapCanvas, DynamicTable, Alert},
    data() {
        const closed = WebSettings.instance.getSetting('map-closed');
        return {
            filter: (a: any) => a,
            selectedRoom: '',
            fs: false,
            closed,
        }
    },
    computed: {
        ...mapState('timetable', ['timetable', 'isLoading', 'error']),
        package() {
            let that = this as any;
            return {
                isLoading: that.isLoading,
                data: that.filter(that.data),
                error: that.error,
            };
        },
        data(): TimetableDay[] {
            // just trust me buddy
            // @ts-ignore
            return Object.values(this.timetable).sort((left: TimetableDay, right: TimetableDay) => {
                const ld = left[0].Date;
                const rd = right[0].Date;
                if (ld === rd) {
                    return 0;
                }
                if (DateParser.IsBefore(ld, rd)) {
                    return -1;
                }
                return 1;
            });
        },
        today() {
            return DateParser.Today();
        }
    },
    watch: {
        closed(isClosed: boolean) {
            WebSettings.instance.setSetting('map-closed', isClosed);
        }
    },
    methods: {
        handleSelect(period: WebTimetablePeriod) {
            const room = period.teacherTimeTable?.Room;
            if (room) {
                this.selectedRoom = room;
            }
        },
        openMap() {
            this.closed = false;
        },
        async fetchTimetable() {
            // await this.$store.dispatch('timetable/fetchTimetable', {date: DateParser.TodayForRequest()});
        },
        async fetchMore() {
            const data = this.data;
            const lastDate = DateParser.AddDays(data[data.length - 1][0].Date, DateParser.COMMON_FORMAT, 7, DateParser.REQUEST_FORMAT);
            // await this.$store.dispatch('timetable/fetchMoreTimetable', {date: lastDate});
        }
    },
    mounted() {
        this.fetchTimetable();
    }
});
</script>

<style lang="less" scoped>

.timetable {
    margin: 0 auto;
    padding: 2rem 2rem;
    width: 95%;


    .timetable__filter {
        float: right;
        margin-bottom: 2rem;
    }

    .timetable__map {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: 30vw;
    }

    .timetable__open-map {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
    }
}

@media screen and (max-width: 1024px) {
    .timetable {
        width: 95%;
    }
}

</style>
