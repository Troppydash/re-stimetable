<template>
    <div class="filterer" :style="{'width': width}">
        <div class="filterer__input">
            <div class="filterer__input-container">
                <input class="st-input"
                       style="padding-right: 3rem; width: 100%"
                       v-model="query"
                       ref="input"
                       placeholder="where Room = ..."
                       @focus="() => onInputFocus(true)" @blur="() => onInputFocus(false)"
                       @keydown="onKey"
                       @click="updateCount">
                <i :class="[{'ri-error-warning-line': !(isOk && isValid) }, 'ri-check-line']"></i>
            </div>
            <button class="st-button"
                    style="height: 3rem;"
                    @click="toggleInfo">{{ today }}
            </button>
        </div>

        <div class="filterer__ac"
             v-show="acFocused || inputFocused"
             :style="{left: `${leftWords}ch`}"
             @focus="() => onAcFocus(true)"
             tabindex="-1">
            <div v-for="(text, index) in ac"
                 @click="acceptAC"
                 @mouseover="() => selectAC(index)"
                 :class="{'filterer__ac--selected': selectedAC === index}">
                {{ text.trimEnd() }}
            </div>
        </div>

        <div v-show="showInfo"
             class="filterer__info">
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
import {PERIOD_DESCRIPTION, PeriodDescription, TimetablePeriod} from "@/lib/data/timetable";

interface AutoCompleteMatcher {
    match: RegExp;
    suggestions: (matched: string, groups: string[]) => string[];
    priority: number;
}

interface AutoCompleteInfo {
    equality: Record<keyof TimetablePeriod, Set<any>>;
}

export default defineComponent({
    name: "Filterer",
    props: ['filter', 'today', 'data', 'isOk'],
    data() {
        return {
            isValid: true,
            query: '',
            filterer: new DataFilterer(),
            inputFocused: false,


            // tabs
            showInfo: false,
            selectedTab: 0,

            // autocomplete
            acFocused: false,
            leftWords: 0,
            selectedAC: 0,
        };
    },
    watch: {
        query: PromiseHelpers.Debounce(function (this: any, newQuery: string) {
            try {
                const filter = this.filterer.getFilter('select * from timetable ' + newQuery);
                this.$emit('update:filter', filter);
                this.isValid = true;
            } catch (e) {
                console.error(e.message);
                this.isValid = false;
            }
        }, 1000),
        ac(newAc: string[], oldAc: string[]) {
            if (newAc.length !== oldAc.length) {
                this.selectedAC = 0;
            }
        }
    },
    computed: {
        ac(): string[] {
            const suggestions = [];

            // try all for matches
            const acInfo = this.acInfo;
            for (const info of acInfo) {
                const result = [...this.query.matchAll(info.match)];
                if (result.length === 0)
                    continue;

                for (const res of result) {
                    if (res.index! + res[0].length === this.leftWords) {
                        suggestions.push({
                            suggestions: info.suggestions(res[0], res.slice(1)),
                            priority: info.priority
                        });
                        break;
                    }
                }
            }

            // sort by priority and flatten array
            return suggestions.sort((l: any, r: any) => {
                if (l.priority === r.priority) {
                    return 0;
                } else if (l.priority > r.priority) {
                    return -1;
                }
                return 1;
            }).map((item: any) => item.suggestions).flat();
        },
        acInfo(): AutoCompleteMatcher[] {
            return [
                {
                    match: /^([^\s]*)$/g,  // the where keyword for empty input
                    priority: 1,
                    suggestions(matched: string, groups: string[]) {
                        const [word] = groups;
                        if (word === 'where')
                            return [];
                        if ('where'.startsWith(word)) {
                            return ['where '];
                        }
                        return [];
                    }
                },
                {
                    match: /(\w+)\s(\W+|in)\s+("[^"]*"|[^\s]+)\s/g,  // keywords for spaces around an expression
                    priority: 0,
                    suggestions() {
                        return ['and ', 'or ', 'not '];
                    }
                },
                {
                    match: /(^where|and|or|not)\s+(\w*)/g,  // adds fields for causes
                    priority: 1,
                    suggestions: (matched: string, groups: string[]) => {
                        const [kw, typed] = groups;
                        return Object.keys(this.dataInfo.equality)
                            .filter(key => {
                                if (!typed)
                                    return true;
                                if (key === typed)
                                    return false;
                                return key.startsWith(typed);
                            }).map(item => item + ' ');
                    }
                },
                {
                    match: /\s(\w+)\s+=\s+("[^"]*|[^\s]*)/g,  // equality helpers
                    priority: 1,
                    suggestions: (matched: string, groups: string[]) => {
                        const [key, word] = groups;
                        const items = this.dataInfo.equality[key as keyof TimetablePeriod];
                        if (!items) {
                            return [];
                        }

                        return Array.from(items).map((item: any) => {
                            if (typeof item === 'string') {
                                return `"${item}"`;
                            }
                            return '' + item;
                        }).filter((item: string) => {
                            return item.startsWith(word) && item !== word;
                        }).map((item: string) => item + ' ');
                    }
                },
                {
                    match: /\s(\w*)\s+in\s+\(\s+([\w\d"]+,\s)*([\w\d"])*/g,  // list helpers
                    priority: 1,
                    suggestions: (matched, groups: string[]) => {
                        const [key, _, word] = groups;
                        const items = this.dataInfo.equality[key as keyof TimetablePeriod];
                        if (!items) {
                            return [];
                        }
                        return Array.from(items).map((item: any) => {
                            if (typeof item === 'string') {
                                return `"${item}"`;
                            }
                            return '' + item + '';
                        }).filter((item: string) => {
                            return (item.startsWith(word) && item !== word) || word === undefined;
                        }).map((item: string) => item + ', ');
                    }
                }
            ];
        },
        dataInfo(): AutoCompleteInfo {
            const equality: Record<string, Set<any>> = {};

            const data = this.data;
            for (const day of data) {
                for (const period of day) {
                    for (const [key, value] of Object.entries(period)) {
                        if (equality[key] === undefined) {
                            equality[key] = new Set();
                        }
                        if (value === '')
                            continue;
                        equality[key].add(value);
                    }
                }
            }
            return {
                equality: equality
            };
        },
        tabs() {
            return Object.keys(PERIOD_DESCRIPTION);
        },
        info(): PeriodDescription {
            return Object.values(PERIOD_DESCRIPTION)[this.selectedTab] as any;
        },
        input(): any {
            return (this as any).$refs.input;
        },
        width(): string {
            if (this.query.length < 40) {
                return '600px';
            } else if (this.query.length < 70) {
                return '1000px';
            }
            return '100%'
        }
    },
    methods: {
        // ridiculous code for a simple dialog
        onInputFocus(focus: boolean) {
            if (!focus) {
                setTimeout(() => {
                    this.inputFocused = focus;
                }, 10);
                return;
            }
            this.inputFocused = focus;
        },
        onAcFocus(focus: boolean) {
            this.acFocused = focus;
        },
        toggleInfo() {
            this.showInfo = !this.showInfo;
        },
        // tabs
        handleClick(index: number) {
            this.selectedTab = index;
        },

        // autocomplete
        onKey(event: any) {
            this.updateCount();

            // arrow keys
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    this.selectedAC = Math.max(this.selectedAC - 1, 0);
                    break;
                case 40:
                    event.preventDefault();
                    this.selectedAC = Math.min(this.selectedAC + 1, this.ac.length - 1);
                    break;
                case 13:
                    event.preventDefault();
                    this.acceptAC();
                    break;

            }
        },
        updateCount() {
            // update the offset
            setTimeout(() => {
                this.leftWords = this.input.selectionStart;
            }, 100);  // evil delay because dom doesn't update in time
        },
        selectAC(index: number) {
            this.selectedAC = index;
        },
        acceptAC() {
            if (this.ac.length === 0)
                return;
            const word = this.ac[this.selectedAC];
            const position = this.leftWords;

            const before = this.query.slice(0, position);
            const matched = word;
            let left = before;

            if (before.length !== 0) {
                for (let i = matched.length - 1; i >= 0; i--) {
                    if (matched[i] === before[before.length - 1]) {
                        // found a common letter
                        if (before.endsWith(matched.slice(0, i + 1))) {
                            left = before.slice(0, before.length - i - 1);
                            break;
                        }
                    }
                }
            }

            this.query = [left, word, this.query.slice(position)].join('');
            this.input.setSelectionRange(position + word.length, position + word.length);
            this.input.focus();
            this.inputFocused = true;
            this.acFocused = false;
            this.updateCount();
        }
    },
    mounted() {
    }
})
</script>

<style lang="less" scoped>

.filterer {
    position: relative;
    font-family: 'Fira Code', monospace;

    .filterer__ac {
        position: absolute;
        top: 2.5rem;
        z-index: 11;
        min-width: 110px;
        max-height: 400px;
        overflow-y: auto;

        & > div {
            padding: 0.25rem 0.5rem;
            background: #ffffff;
            color: black;
            cursor: default;

            &.filterer__ac--selected {
                background: #0b53bf;
                color: white;
            }
        }
    }

    .filterer__input {
        display: flex;

        .filterer__input-container {
            flex: 1 1;
            display: inline-block;
            position: relative;

            & > i {
                position: absolute;
                right: 1rem;
                top: 25%;
                color: var(--st-text);
                font-size: 150%;
            }
        }
    }

    .filterer__info {
        position: absolute;
        top: 3rem;
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
