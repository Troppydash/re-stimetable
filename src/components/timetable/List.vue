<template>
    <div class="st-list st-list--full st-list--fill st-list--primary st-list--scrollable">
        <div class="st-list__section" v-for="day in data">
            <div class="st-list__header" style="position:sticky; top: 0">
                {{ formatDate(day[0].Date) }}
            </div>
            <div v-for="period in day"
                 class="st-list__item st-list__item--big"
                 :class="{'st-vtable--selected': selected && selected === encode({period})}"
                 @click="() => handleSelect(period)">
                <div class="list-flex">
                    <div style="margin-right: 1rem">
                        <p class="st-text">{{ period.PeriodID }}</p>
                    </div>
                    <div style="flex: 1 1">
                        <p class="st-text">{{ period.Subject }}</p>
                        <p class="st-text st-text--80">{{ period.Teacher }}</p>
                    </div>
                    <p class="st-text" style="float: right">{{ period.Room }}</p>
                </div>
            </div>
        </div>
        <div style="text-align: center; height: 100px" @click="onMore" v-show="!isLoading">
            <p class="st-text st-text--link">Load More</p>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {TimetableDay, TimetableHelpers, TimetablePeriod} from "@/lib/data/timetable";
import {DateParser} from "@/lib/dates/dateParser";


export default defineComponent({
    name: "List",
    props: ['content', 'isLoading', 'onMore', 'selected'],
    computed: {
        data(): TimetableDay[] {
            return this.content;
        }
    },
    methods: {
        handleSelect(period: TimetablePeriod) {
            this.$emit('update:selected', TimetableHelpers.EncodePeriod({period}));
        },
        formatDate(date: string): string {
            return DateParser.ReFormat(date, DateParser.COMMON_FORMAT, 'dddd, DD MMM')
        },
        encode: TimetableHelpers.EncodePeriod
    }
})
</script>

<style lang="less" scoped>
@import "../../css/addons";

.st-list {
    .st-list__item {
        height: 50px;

        &.st-list__item--big {
            padding: 0.5rem;
        }
    }

    .st-list__section {
        margin-bottom: 0.5rem;
    }

    &.st-list--scrollable {
        overflow-y: scroll;
    }
}

.list-flex {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: var(--st-background-focus);
}

::-webkit-scrollbar-thumb {
    background: var(--st-secondary);
}

::-webkit-scrollbar-thumb:hover {
    background: var(--st-secondary-hover);
}


</style>
