<template>
    <Topbar />
    <router-view/>
</template>

<script>
import Topbar from "@/components/topbar/Topbar";
export default {
    components: {Topbar}
}
</script>

<style lang="less">
// the custom stylesheet here
@import "../node_modules/stimetable.css/stimetable.css";

// general styles
html,
body {
    font-family: 'Roboto', sans-serif;  // dont like the light style

    margin: 0;
    min-height: 100vh;
}

* {
    transition-duration: 100ms;
}

.st-text.st-text--bold {
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
}
</style>
