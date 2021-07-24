<template>
    <div class="timetable">
        <!-- Querying -->
        <div class="timetable__filter">
            <Filterer v-model:filter="filter"
                      :today="today"
                      :data="data"
                      :is-ok="isOk"/>
        </div>

        <!-- Timetable -->
        <div class="timetable__table">
            <DynamicTable :package="package"
                          :on-more="fetchMore"
                          v-model:selected="selected"/>
        </div>

        <!-- Map -->
        <div :class="{'timetable__map': !fs}">
            <MapCanvas :is-minimized="true"
                       v-model:fs="fs"
                       v-model:closed="closed"
                       :selected="selectedRoom"/>
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
import {TimetableHelpers, WebTimetablePeriod} from "@/lib/data/timetable";
import {WebSettings} from "@/lib/settings";
import Filterer from "@/components/controls/Filter/Filterer.vue";

const BASE_DATE = DateParser.Today();
const MAX_DAYS = 150;
const DATE_MAX = DateParser.AddDays(BASE_DATE, MAX_DAYS);

export default defineComponent({
    name: "Timetable",
    components: {Filterer, MapCanvas, DynamicTable, Alert},
    data() {
        const closed = WebSettings.instance.getSetting('map-closed');
        return {
            filter: (a: any) => a,
            selected: '',
            fs: false,
            closed,
            isOk: true,

            nextDate: DateParser.Today(),
        }
    },
    computed: {
        ...mapState('timetable', ['timetable', 'isLoading', 'error']),
        package() {
            let that = this as any;
            let data = that.data;
            try {
                data = that.filter(data);
                this.isOk = true;
            } catch (e) {
                console.error(e.message);
                this.isOk = false;
            }
            return {
                isLoading: that.isLoading,
                data,
                error: that.error,
            };
        },
        today() {
            return DateParser.Today();
        },
        selectedRoom() {
            return TimetableHelpers.DecodePeriod((this as any).selected).room;
        },
        data() {
            return TimetableHelpers.ToSortedDays((this as any).timetable);
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
        adjustNextDate() {
            const data = this.data;
            const ttNextDate = data[data.length - 1][0].Date;
            if (DateParser.IsBefore(this.nextDate, ttNextDate)) {
                this.nextDate = ttNextDate;
            }
            this.nextDate = DateParser.AddDays(this.nextDate, 7);
        },
        async fetchTimetable() {
            await this.$store.dispatch('timetable/fetchTimetable', {date: this.nextDate});
            this.adjustNextDate();
        },
        async fetchMore() {
            if (DateParser.IsBefore(this.nextDate, DATE_MAX)) {
                await this.$store.dispatch('timetable/fetchMoreTimetable', {
                    date: this.nextDate
                });
                this.adjustNextDate();
            }
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
        display: flex;
        justify-content: flex-end;
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
