<template>
    <Topbar/>
    <router-view/>
    <AlertShadow/>
    <UpdateHandler/>
</template>

<script>
import Topbar from "@/components/topbar/Topbar";
import {WebSettings} from "@/lib/settings";
import Notifications from "@/components/controls/Alerts/AlertShadow";
import Alert from "@/components/controls/Alerts/Alert";
import AlertShadow from "@/components/controls/Alerts/AlertShadow";
import UpdateHandler from "@/components/workers/UpdateHandler";
import alerts from "@/lib/mixins/alerts";

function filterKeys(object, keys) {
    const newObj = {};
    for (const [key, value] of Object.entries(object)) {
        if (keys.includes(key)) {
            newObj[key] = value;
        }
    }
    return newObj;
}

export default {
    components: {UpdateHandler, AlertShadow, Alert, Notifications, Topbar},
    mixins: [alerts],
    methods: {
        async parseParams() {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            console.log(params);
            // filter for keys
            const temp = filterKeys(params, ["name", "keycode"]);
            console.log(temp);

            if (Object.keys(temp).length > 0) {
                this.alert({
                    title: 'Account',
                    text: 'Temporary account used, go to SETTINGS and click CHANGE under Alias and Keycode to save'
                }, 10000);
                await this.$store.dispatch('auth/updateTemp', temp);
                return true;
            }
            return false;
        }
    },
    async mounted() {
        // parse query data
        await this.parseParams();

        await this.$store.dispatch('init', { settings: WebSettings.instance});
    }
}
</script>

<style lang="less">
// the custom stylesheet here
@import "../node_modules/stimetable.css/stimetable.css";

// general styles
html,
body {
    font-family: 'Roboto', sans-serif; // dont like the light style

    margin: 0;
    min-height: 100vh;

    scroll-behavior: smooth;
}

#app {
    position: relative;
}

.st-text {
    &.st-text--bold {
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
    }

    &.st-text--skeleton {
        opacity: 0.3;
        width: fit-content;
        box-sizing: border-box;

        text-indent: 100%;
        white-space: nowrap;
        overflow: hidden;
        background: linear-gradient(267deg, var(--st-text-dim), var(--st-text));
        background-size: 400% 400%;

        animation: Flash 2s ease infinite;

        @keyframes Flash {
            0%{background-position:0% 50%}
            50%{background-position:100% 50%}
            100%{background-position:0% 50%}
        }
    }
}

@import "css/shadow";
@import "css/fab";

</style>
