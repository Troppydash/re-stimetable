<template>
    <div class="bar"></div>
    <div class="topbar">
        <div class="topbar__actions">
            <router-link to="/timetable"
                         class="st-text st-text--link st-text--bold">
                TIMETABLE
            </router-link>
            <router-link to="/settings"
                         class="st-text st-text--link st-text--bold">
                SETTINGS
            </router-link>
        </div>
        <div class="topbar__details">
            <span class="st-text st-text--bold">I AM </span>
            <span class="st-text">{{ username }}</span>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import {helpers} from "@/lib/helpers";

export default {
    name: 'Topbar',
    computed: {
        ...mapGetters('auth', [
            'name',
            'isTemp'
        ]),
        username() {
            return helpers.stringLimit(this.name, 20);
        }
    }
}
</script>

<style lang="less" scoped>

.bar {
    border-top: 0.5rem solid var(--st-primary);
}

.topbar {
    width: 900px;
    margin: 0 auto;
    background: var(--st-primary);

    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    z-index: 20;

    .st-text {
        color: var(--st-primary-text);
    }


    .st-text:active {
        color: var(--st-primary-text-dim);
    }

    .topbar__actions {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0.75rem 1rem;

        & > * {
            margin: 0 1rem;
        }


    }

    .topbar__details {
        padding: 0.75rem 1rem;
    }
}

@media screen and (max-width: 1024px) {
    .bar {
        display: none;
    }

    .topbar {
        width: 100%;
    }

}

</style>
