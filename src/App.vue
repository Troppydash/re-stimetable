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
    margin: 0;
}

* {
    transition-delay: 100ms;
    transition-duration: 100ms;
}

</style>
