<template>
    <div class="bar"></div>
    <div class="topbar">
        <div class="topbar__actions">
            <div class="st-tooltip st-tooltip--bottom">
                <span class="st-tooltip__text">View Timetables</span>
                <router-link to="/timetable"
                             class="st-text st-text--link st-text--bold">
                    TIMETABLE
                </router-link>
            </div>
            <div class="st-tooltip st-tooltip--bottom">
                <span class="st-tooltip__text">View Settings</span>
                <router-link to="/settings"
                             class="st-text st-text--link st-text--bold">
                    SETTINGS
                </router-link>
            </div>
        </div>
        <div class="topbar__details">
            <span class="st-text">Hello: {{ username }}</span>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {helpers} from "@/lib/helpers";

export default {
    name: 'Topbar',
    computed: {
        ...mapState({
            name: 'auth/name'
        }),
        username() {
            const name = this.name;
            if (!name) {
                return 'unnamed';
            }
            return helpers.stringLimit(name, 20);
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
        width: 100vw;
    }

}

</style>
