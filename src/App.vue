<template>
    <Topbar/>
    <router-view/>
    <AlertShadow/>
</template>

<script>
import Topbar from "@/components/topbar/Topbar";
import {WebSettings} from "@/lib/settings";
import Notifications from "@/components/controls/Alerts/AlertShadow";
import Alert from "@/components/controls/Alerts/Alert";
import AlertShadow from "@/components/controls/Alerts/AlertShadow";

export default {
    components: {AlertShadow, Alert, Notifications, Topbar},
    mounted() {
        this.$store.dispatch('init', { settings: WebSettings.instance});
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
    height: 100%;
}

#app {
    position: relative;
}

.st-text.st-text--bold {
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
}

@import "css/shadow";

</style>
