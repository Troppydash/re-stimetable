<template>
    <div class="about">
        <p class="st-text st-text--header">About This Website</p>
        <div class="st-section">
            <p class="st-text st-text--section st-section__title">The Purpose</p>
            <p class="st-text">
                A remade version of the stimetable website, there are no obvious intentions for the creation, or rather,
                recreation
                of the site. While this remake lacks the account and cloud database support, it builds upon the original
                site by including powerful queries, a simpler user interface, and overall a less-coupled codebase.
            </p>
        </div>
        <div class="st-section">
            <p class="st-text st-text--section st-section__title">How It Works</p>
            <p class="st-text">
                A "keycode", unique to each student is needed to retrieve the school database for timetables. The
                website
                simply guesses this keycode by the information supplied by you, and renders the timetable with a collage
                map.
            </p>
        </div>
        <div class="st-section">
            <p class="st-text st-text--section st-section__title">Site Resources</p>
            <p class="st-text">
                Styling: <a class="st-text st-text--link" target="_blank"
                            href="https://github.com/Troppydash/stimetable.css">https://github.com/Troppydash/stimetable.css</a>
                <br/>
                GLTF Collage Map: <a class="st-text st-text--link" target="_blank"
                                     href="https://github.com/Troppydash/re-stimetable/tree/master/public/maps">https://github.com/Troppydash/re-stimetable/tree/master/public/maps</a>
                <br/>
                Map Renderer: <a class="st-text st-text--link" target="_blank"
                                 href="https://github.com/Troppydash/stimetable/tree/master/map-renderer">https://github.com/Troppydash/stimetable/tree/master/map-renderer</a>
                <br/>
                Server API: <a class="st-text st-text--link" target="_blank"
                               href="https://dry-sierra-69491.herokuapp.com">https://dry-sierra-69491.herokuapp.com</a>
                <br/>
                Old Site (if you are curious): <a class="st-text st-text--link" target="_blank"
                                                  href="https://stimetable.vercel.app">https://stimetable.vercel.app</a>
            </p>
        </div>
        <div class="st-section">
            <p class="st-text st-text--section st-section__title">Libraries Used</p>
            <p class="st-text">
                Vue 3 with typescript, vue-router, and vuex for the website
                <br/>
                dayjs for dates
                <br/>
                js-sql-parser for generating the ast tree of sql queries
                <br/>
                THREE.js as the dependency of the custom map renderer
                <br/>
                less for styling
                <br/>
                And much more..., thank you
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "About"
}
</script>

<style lang="less" scoped>
@import "../../css/addons";

</style>
