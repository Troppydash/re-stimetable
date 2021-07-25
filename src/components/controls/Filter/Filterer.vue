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
            <input class="st-input"
                   style="height: 3rem;width: calc(10ch + 2.1rem);" v-model="_today"/>
            <button class="st-button"
                    style="height: 3rem; width: 3rem; display:flex; justify-content: center;align-items: center"
                    @click="toggleInfo">
                <i class="ri-menu-line"></i>
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
            <div class="filterer__title">
                <p class="st-text st-text--130">Columns Specifications</p>
            </div>
            <div class="filterer__content">
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
            <div class="filterer__footer">
                <span class="st-text st-text--80">{{ filterInfo.columns }} columns</span>
                <span class="st-text st-text--80">{{ filterInfo.total }} total</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {PromiseHelpers} from "@/lib/promise/common";
import {DataFilterer} from "@/lib/data/filterer";
import {PERIOD_DESCRIPTION, PeriodDescription, TimetablePeriod} from "@/lib/data/timetable";
import {DateParser} from "@/lib/dates/dateParser";

interface AutoCompleteMatcher {
    match: RegExp;
    suggestions: (matched: string, groups: string[]) => string[];
    priority: number;
}

interface AutoCompleteInfo {
    equality: Record<keyof TimetablePeriod, Set<any>>;
}

function matchRemains(suggestions: string[], word: string | undefined, trailing: string = ' ') {
    return suggestions.filter(item => {
        return word === undefined || item.startsWith(word) && item !== word;
    }).map(item => item + trailing);
}

export default defineComponent({
    name: "Filterer",
    props: ['filter', 'data', 'isOk', 'status', 'today'],
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

            _today: this.today
        };
    },
    watch: {
        _today(newValue: string) {
            if (DateParser.IsValid(newValue)) {
                this.$emit('update:today', newValue);
            }
        },
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
        filterInfo(): any {
            const data = this.status.package.data;
            return {
                columns: data.length,
                total: data.flat().length
            };
        },
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
                        return matchRemains(['where'], word);
                    }
                },
                {
                    match: /(where|and|or)\s*( not)?\s+(\w+)\s+([^\s])*/g,
                    priority: 1,
                    suggestions(matched: string, groups: string[]) {
                        const [kw, op, not, word] = groups;
                        return matchRemains(['=', '!=', '>', '>=', '<', '<=', 'in'], word)
                    }
                },
                {
                    match: /(\w+)\s(\W+|in)\s+("[^"]*"|[^\s]+)\s+(\w*)/g,  // keywords for spaces around an expression
                    priority: 0,
                    suggestions(matched: string, groups: string[]) {
                        const [item, kw, value, word] = groups;
                        return matchRemains(['and', 'or'], word);
                    }
                },
                {
                    match: /(where|and|or)\s*( not)?\s+(\w*)/g,  // adds fields for causes
                    priority: 1,
                    suggestions: (matched: string, groups: string[]) => {
                        const [kw, not, typed] = groups;
                        return matchRemains(Object.keys(this.dataInfo.equality), typed);
                    }
                },
                {
                    match: /\s*(not)?\s+(\w+)\s+(>|>=|<|<=|=|!=)\s+("[^"]*|[^\s]*)/g,  // equality helpers
                    priority: 1,
                    suggestions: (matched: string, groups: string[]) => {
                        const [not, key, op, word] = groups;
                        const items = this.dataInfo.equality[key as keyof TimetablePeriod];
                        if (!items) {
                            return [];
                        }

                        return matchRemains(Array.from(items).map((item: any) => {
                            if (typeof item === 'string') {
                                return `"${item}"`;
                            }
                            return '' + item;
                        }), word);
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
                        return matchRemains(Array.from(items).map((item: any) => {
                            if (typeof item === 'string') {
                                return `"${item}"`;
                            }
                            return '' + item + '';
                        }), word, ', ');
                    }
                },
                {
                    match: /\sin\s+/g,
                    priority: 1,
                    suggestions(matched, groups: string[]) {
                        return ['( '];
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
            if (this.query.length < 30) {
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
        top: 3.5rem;
        left: 0;
        z-index: 10;

        width: 100%;

        background: var(--st-background);

        border: 1px solid var(--st-secondary);

        .filterer__content {
            display: flex;

            .filterer__tabs {
                overflow-y: auto;
                flex: 0 0 200px;
                border-right: 1px solid var(--st-secondary);

                .filterer__tab {
                    padding: 0.5rem;

                    &--selected {
                        background: var(--st-background-hover) !important;
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

        .filterer__title {
            background: var(--st-background);
            padding: 0.5rem;

            border-bottom: 1px solid var(--st-secondary);
        }

        .filterer__footer {
            display: flex;
            align-content: center;
            justify-content: flex-end;

            background: var(--st-background-focus);
            padding: 0.1rem;

            & > * {
                padding: 0 0.4rem;
            }

            & > * + * {
                border-left: 1px solid var(--st-text);
            }
        }
    }
}

</style>
