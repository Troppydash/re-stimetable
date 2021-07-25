<template>
    <div class="settings">
        <div class="settings__sidebar">
            <div class="st-list st-list--big st-list--primary">
                <div class="st-list__section">
                    <div class="st-list__header st-text st-text--250">Settings</div>
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

const TABS = ['Account', 'Advanced', 'About'];

export default defineComponent({
    name: "Settings",
    components: {Advanced, About, Account},
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

    }
})
</script>

<style lang="less" scoped>
@import "../css/addons";

.settings {
    margin: 4rem auto 0;
    width: 900px;
    padding-bottom: 5rem;

    display: flex;

    .settings__sidebar {
        margin-right: 2rem;
        position: sticky;
        top: 0;
        align-self: flex-start;
    }

    .settings__content {
        flex: 1 1;
        padding: 1rem 2rem;
    }
}

</style>
