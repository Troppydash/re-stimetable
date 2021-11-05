<template>
    <div class="settings">
        <div class="settings__sidebar">
            <div class="st-list st-list--big st-list--primary st-list--responsive st-list--full">
                <div class="st-list__section">
                    <div v-for="(tab, index) in tabs"
                         class="st-list__item"
                         :class="{'st-list__selected': index === selectedTab}"
                         @click="() => onChangeTab(index)">
                        {{ tab }}
                    </div>
                </div>
            </div>
        </div>
        <div class="settings__content">
            <Account v-if="selectedTab === 0"/>
            <Advanced v-if="selectedTab === 1"/>
            <About v-if="selectedTab === 2"/>
        </div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {WebSettings} from "@/lib/settings";
import {mapState} from "vuex";
import Account from "@/components/settings/Account.vue";
import About from "@/components/settings/About.vue";
import Advanced from "@/components/settings/Advanced.vue";
import alerts from "@/lib/mixins/alerts";

const TABS = ['Account', 'Advanced', 'About'];

export default defineComponent({
    name: "Settings",
    components: {Advanced, About, Account},
    mixins: [alerts],
    data() {
        return {
            selectedTab: 0,
            tabs: TABS,
        }
    },
    computed: {
    },
    methods: {
        onChangeTab(index: number) {
            this.selectedTab = index;
        }
    },
    mounted() {
        // this.alert({
        //     title: "HELLO WORLD HELLO WORLDHELLO WORLDHELLO WORLD",
        //     text: 'HELLO WORLDHELLO WORLDHELLO WORLD'
        // }, -1);
    }
})
</script>

<style lang="less" scoped>
@import "../css/addons";

.settings {
    margin: 2rem auto 0;
    width: 1100px;
    max-width: 95vw;
    padding-bottom: 5rem;

    display: flex;

    .settings__sidebar {
        min-width: 200px;
        margin-right: 1rem;
        position: sticky;
        top: 1rem;
        align-self: flex-start;
    }

    .settings__content {
        flex: 1 1;
        padding: 0 1rem;
    }
}

@media screen and (max-width: 1024px) {
    .settings {
        flex-direction: column;
        width: 100%;
        padding: 1.5rem;
        padding-top: 0;
        margin: 0 auto;

        .settings__sidebar {
            padding: 0.5rem 0;
            position: sticky;
            top: 0;

            width: 100%;
            background: var(--st-background);
            z-index: 10;
        }

        .settings__content {
            padding: 0;
        }
    }

    .st-list--responsive {
        .st-list__section {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

            .st-list__header {
                display: none;
            }
        }
    }
}

@media screen and (max-width: 764px) {
    .settings {
        padding: 1rem;
        padding-top: 0;
    }
}

</style>
