<template>
    <div class="timetable">
        <!-- Querying -->
        <div class="timetable__filter">
            <Filterer v-model:filter="filter"
                      :data="data"
                      :is-ok="isOk"
                      v-model:today="today"
                      :status="{package}"/>
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
import alerts from "@/lib/mixins/alerts";

const BASE_DATE = DateParser.Today();
const MAX_DAYS = 200;
const DATE_MAX = DateParser.AddDays(BASE_DATE, MAX_DAYS);

export default defineComponent({
    name: "Timetable",
    components: {Filterer, MapCanvas, DynamicTable, Alert},
    mixins: [alerts],
    data() {
        const closed = WebSettings.instance.getSetting('map-closed');
        return {
            filter: (a: any) => a,
            selected: '',
            fs: false,
            closed,
            isOk: true,

            today: DateParser.Today(),
            nextDate: DateParser.Today(),
            dateMax: DateParser.AddDays(DateParser.Today(), MAX_DAYS)
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
        selectedRoom() {
            return TimetableHelpers.DecodePeriod((this as any).selected).room;
        },
        data() {
            return TimetableHelpers.ToSortedDays((this as any).timetable);
        }
    },
    watch: {
        today() {
            this.nextDate = this.today;
            this.dateMax = DateParser.AddDays(this.today, MAX_DAYS);
            this.fetchTimetable();
        },
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
            if (data.length > 0) {
                const ttNextDate = data[data.length - 1][0].Date;
                if (DateParser.IsBefore(this.nextDate, ttNextDate)) {
                    this.nextDate = ttNextDate;
                }
            }
            this.nextDate = DateParser.AddDays(this.nextDate, 5);
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
    async mounted() {
        await this.fetchTimetable();
        if (this.data.length === 0) {
            this.alert({
                title: 'Bad Keycode',
                text: 'Head to SETTINGS under section Setup your Keycode in ACCOUNT'
            }, 10 * 1000);
        }
    }
});
</script>

<style lang="less" scoped>

.timetable {
    margin: 0 auto;
    padding: 2rem;
    padding-top: 0;
    width: 95%;


    .timetable__filter {
        display: flex;
        justify-content: flex-end;
        margin: 1.5rem 0;
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

    .timetable__table {
    }
}

@media screen and (max-width: 1024px) {
    .timetable {
        margin: 0 !important;
        padding: 2rem;
        padding-top: 0;
        width: 100%;

        .timetable__filter {
            margin: 1rem 0;
        }


        .timetable__table {
            display: flex;
            height: calc(100vh - 250px);
        }

        .timetable__map {
            width: ~"min(60vw, 300px)";
            bottom: 0;
            right: 0;
        }
    }
}

@media screen and (max-width: 764px) {
    .timetable {
        padding: 2rem 0.5rem;
        padding-top: 0;

        .timetable__filter {
            margin: 0.5rem 0;
        }
    }
}

</style>
