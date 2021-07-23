<template>
    <div class="filterer">
        <div class="filterer__input">
            <input class="st-input"
                   style="width: 500px"
                   v-model="query"
                   ref="input"
                   @focus="onInputFI" @blur="onInputFO"
                   @keydown="onKey"/>
            <input class="st-input"
                   size="6"
                   :value="today" disabled/>
        </div>
        <div v-show="true || infoFocused || inputFocused"
             class="filterer__info" tabindex="-1"
             @focus="onInfoFI" @blur="onInfoFO">
            <div class="filterer__tabs">
                <div v-for="(tab, index) in tabs"
                     @click="() => handleClick(index)"
                     class="filterer__tab"
                     :class="{'filterer__tab--selected':  tabs[selectedTab] === tab }">
                    <span class="st-text">{{ tab }}</span>
                </div>
            </div>
            <div class="filterer__body">
                <p class="st-text st-text--170">{{ tabs[selectedTab] }}</p>
                <hr/>
                <p class="st-text">{{ info.inShort }}</p>
                <br/>
                <br/>
                <p class="st-text">Specification</p>
                <table class="st-table st-table--small st-table--full">
                    <tbody style="font-family: 'Fira Code', monospace">
                    <tr v-for="([key, value]) in Object.entries(info.spec)">
                        <td style="width: 100px">{{ key }}</td>
                        <td>{{ value }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {PromiseHelpers} from "@/lib/promise/common";
import {DataFilterer} from "@/lib/data/filterer";
import {PERIOD_DESCRIPTION, PeriodDescription} from "@/lib/data/timetable";

export default defineComponent({
    name: "Filterer",
    props: ['filter', 'today'],
    data() {
        return {
            query: 'select * from timetable',
            filterer: new DataFilterer(),
            inputFocused: false,
            infoFocused: false,
            selectedTab: 0
        };
    },
    watch: {
        query: PromiseHelpers.Debounce(function (this: any, newQuery: string) {
            try {
                const filter = this.filterer.getFilter(newQuery);
                this.$emit('update:filter', filter);
            } catch (err) {
                this.$shadow.evoke('showAlert', 'cannot parse sql');
            }
        }, 1000)
    },
    computed: {
        tabs() {
            return Object.keys(PERIOD_DESCRIPTION);
        },
        info(): PeriodDescription {
            return Object.values(PERIOD_DESCRIPTION)[this.selectedTab] as any;
        }
    },
    methods: {
        // ridiculous code for a simple dialog
        onInputFI() {
            this.inputFocused = true;
        },
        onInputFO() {
            setTimeout(() => {
                this.inputFocused = false;
            }, 100);
        },
        onInfoFI() {
            this.infoFocused = true;
        },
        onInfoFO() {
            setTimeout(() => {
                this.infoFocused = false;
            }, 100);
        },
        handleClick(index: number) {
            this.selectedTab = index;
        },
        onKey(event: any) {
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    this.selectedTab = Math.max(this.selectedTab - 1, 0);
                    break;
                case 40:
                    event.preventDefault();
                    this.selectedTab = Math.min(this.selectedTab + 1, this.tabs.length - 1);
                    break;
            }
        }
    },
    mounted() {
    }
})
</script>

<style lang="less" scoped>

.filterer {
    position: relative;

    .filterer__input {
        font-family: 'Fira Code', monospace;
    }

    .filterer__info {
        font-family: 'Fira Code', monospace;

        position: absolute;
        top: 4rem;
        left: 0;
        z-index: 10;

        width: 100%;

        background: var(--st-background);
        opacity: 1;

        display: flex;

        border: 1px solid var(--st-secondary);

        .filterer__tabs {
            overflow-y: auto;
            flex: 0 0 200px;
            border-right: 1px solid var(--st-secondary);

            .filterer__tab {
                padding: 1rem;

                &--selected {
                    background: var(--st-background-focus) !important;
                }

                &:hover {
                    background: var(--st-background-hover);
                }
            }

            & > div + div {
                border-top: 1px solid var(--st-secondary);
            }
        }

        .filterer__body {
            flex: 1 1;
            padding: 0.75rem 1rem;
        }
    }
}

</style>
