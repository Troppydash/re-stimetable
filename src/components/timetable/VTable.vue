<template>
    <div class="st-vtable">
        <!-- first column -->

        <!-- skeleton -->
        <div v-if="isLoading || isEmpty" class="st-vtable__header st-vtable__column">
            <!-- This is the top right divider label -->
            <div class="st-vtable__label">
                <span class="st-text st-text--110 st-text--skeleton">Period \ Date</span>
            </div>
            <!-- the row labels are here -->
            <div v-for="(index) in Array.from({length: 6})">
                <p class="st-text st-text--skeleton">Period {{ index + 1 }}</p>
                <p class="st-text st-text--80 st-text--skeleton">From 9:30 To 10:30</p>
            </div>
        </div>
        <!-- real data -->
        <div v-else class="st-vtable__header st-vtable__column">
            <!-- This is the top right divider label -->
            <div class="st-vtable__label">
                <span class="st-text st-text--110">Period \ Date</span>
            </div>
            <!-- the row labels are here -->
            <div v-for="(period, index) in leftestDay">
                <p class="st-text">Period {{ index + 1 }}</p>
                <p class="st-text st-text--80">From {{ period.FromTime }} To {{ period.ToTime }}</p>
            </div>
        </div>

        <!-- the rest of the data -->

        <!-- skeleton -->
        <div v-if="isLoading || isEmpty" class="st-vtable__body" ref="body">
            <div class="scroller" ref="scroller">
                <div v-for="index in Array.from({length: 6})"
                     class="st-vtable__column" :class="{'st-vtable__column--friday': index % 5 === 4}">
                    <!-- the date -->
                    <div class="st-vtable__label">
                        <span class="st-text st-text--110 st-text--skeleton">Monday, 23 August</span>
                    </div>
                    <div v-for="(period) in Array.from({length: 6})">
                        <p class="st-text st-text--skeleton">SL Chemistry</p>
                        <p class="st-text st-text--80 st-text--skeleton">Mr S A Lawrenson</p>
                        <p class="st-text st-text--skeleton" style="float: right">R19</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- real data -->
        <div v-else class="st-vtable__body" ref="body">
            <!-- left scroller-->
            <div v-show="showLeftScroll" @click="() => scroll(-1)"
                 class="st-vtable__scroller">
                <i class="ri-arrow-left-s-fill"></i>
            </div>
            <!-- columns of each day -->
            <div class="scroller" ref="scroller">
                <div v-for="(day, index) in content"
                     class="st-vtable__column" :class="{'st-vtable__column--friday': shouldSeparate(index)}">
                    <!-- the date -->
                    <div class="st-vtable__label">
                        <span class="st-text st-text--110">{{ formatDate(day[0].Date) }}</span>
                    </div>
                    <div v-for="(period) in day"
                         @click="() => handleSelect(period)"
                         :class="{'st-vtable--selected': selected && selected === encode({period})}">
                        <p class="st-text">{{ period.Subject }}</p>
                        <p class="st-text st-text--80">{{ period.Teacher }}</p>
                        <p class="st-text" style="float: right">{{ period.Room }}</p>
                    </div>
                </div>
            </div>
            <!-- right scroller-->
            <div v-show="showRightScroll" @click="() => scroll(1)"
                 class="st-vtable__scroller st-vtable__scroller--right">
                <i class="ri-arrow-right-s-fill"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
    TimetablePeriod, TimetableDay, TimetableHelpers
} from "@/lib/data/timetable";
import {DateParser} from "@/lib/dates/dateParser";
import {PromiseHelpers} from "@/lib/promise/common";

const COLUMN_WIDTH = 300;

export default defineComponent({
    name: "VTable",
    props: ['content', 'isLoading', 'onMore', 'selected'],
    data() {
        return {
            bodyWidth: 0,
            bodyVisible: 0,
            bodyScroll: 0,
        };
    },
    watch: {
        async content(newContent: TimetableDay[], oldContent: TimetableDay[]) {
            await this.waitForUpdate();
            if (newContent.length < oldContent.length) {
                this.bodyScroll = 0;
                this.scroll(0);
            }
            this.updateSize();
            await this.checkMore();
        }
    },
    computed: {
        showLeftScroll(): boolean {
            return this.bodyScroll > 0;
        },
        showRightScroll(): boolean {
            return this.bodyWidth > (this.bodyScroll + this.bodyVisible);
        },
        leftestDay(): TimetableDay {
            if (this.content.length === 0) {
                const data = Object.values(this.$store.getters['timetable/timetable']);
                if (data.length > 0)
                    return data[0] as TimetableDay;
                return [] as any;
            }
            return this.content[~~(this.bodyScroll / COLUMN_WIDTH)];
        },
        isEmpty() {
            return this.leftestDay.length === 0;
        }
    },
    methods: {
        encode: TimetableHelpers.EncodePeriod,
        handleSelect(period: TimetablePeriod) {
            this.$emit('update:selected', TimetableHelpers.EncodePeriod({period}));
        },
        shouldSeparate(index: number) {
            const day = this.content[index];
            return index+1 !== this.content.length
                && DateParser.ReFormat(day[0].Date, DateParser.COMMON_FORMAT, 'dddd') === 'Friday';
        },
        scroller(): HTMLElement {
            return this.$refs.scroller as any;
        },
        body(): HTMLElement {
            return this.$refs.body as any;
        },
        scroll(multiplier: number = 1) {
            this.bodyScroll += COLUMN_WIDTH * multiplier;
            this.scroller().scrollTo({
                left: this.bodyScroll,
                behavior: 'smooth'
            });
            this.checkMore();
        },
        formatDate(date: string): string {
            return DateParser.ReFormat(date, DateParser.COMMON_FORMAT, 'dddd, DD MMM')
        },
        updateSize() {
            this.bodyWidth = this.scroller().scrollWidth;
            this.bodyVisible = this.body().clientWidth;
        },
        async waitForUpdate() {
            return PromiseHelpers.WaitUntil(() => this.scroller().scrollWidth !== 0);
        },
        async checkMore() {
            this.updateSize();
            if (this.bodyWidth - (this.bodyScroll + this.bodyVisible) < COLUMN_WIDTH / 2) {
                if (this.onMore) {
                    await this.onMore()
                }
                await this.waitForUpdate();
                this.updateSize();
            }
        }
    },
    async mounted() {
        this.updateSize();
        await PromiseHelpers.WaitUntil(() => !this.isLoading);
        await this.checkMore();
    }
});
</script>

<style lang="less" scoped>
@border-color1: var(--st-secondary);
@border1: 1px solid @border-color1;
@border-color2: var(--st-primary-focus);
@border2: 2px dashed @border-color2;

.st-vtable {
    color: var(--st-text);

    width: 100%;
    display: flex;
    font-family: 'Roboto Light', sans-serif;

    .st-vtable__column + .st-vtable__column {
        border-left: @border1;
    }

    .st-vtable__column {
        flex: 0 0 300px;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;


        cursor: pointer;

        .st-vtable__label {
            background: var(--st-primary);
            color: var(--st-primary-text);
            padding: 0 0.5rem;
            height: 10%;
            display: flex;
            align-items: center;
        }

        & > div {
            text-align: left;
            padding: 0.5rem;
            height: 80px;
        }

        & > div:not(.st-vtable__label) + div:not(.st-vtable__label) {
            border-top: @border1;
        }

        &.st-vtable__column--friday {
            border-right: @border2;
        }


        .st-vtable--selected {
            background: var(--st-background-focus);
        }
    }

    .st-vtable__header {
        flex: 0 0 200px;
        cursor: initial;
        border-right: @border1;
    }

    .st-vtable__body {
        width: calc(100% - 200px);
        position: relative;

        .scroller {
            overflow: hidden;
            display: flex;
            justify-content: left;
            align-items: stretch;
        }

        .st-vtable__scroller {
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;

            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.25);

            &:hover {
                background: rgba(0, 0, 0, 0.35);
                cursor: pointer;
            }

            &.st-vtable__scroller--right {
                right: 0;
                left: initial;
            }
        }
    }
}

</style>
