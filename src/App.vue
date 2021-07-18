<template>
    <div id="nav">
        <div class="st-text">Hello World</div>
        <router-link to="/">Home</router-link>
        |
        <router-link to="/about">About</router-link>
    </div>
    <router-view/>
</template>

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
