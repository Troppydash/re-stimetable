<template>
    <div class="error-container">
        <p class="st-text st-text--title">Page Not Found</p>
        <br/>
        <p class="st-text">The URL <code class="url-text">{{ url }}</code> does not exist</p>
        <br/>
        <br/>
        <router-link :to="{ name: 'Showcase' }">
            <button class="st-button st-button--primary">
                <span>Go to Showcase</span>
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "404",
    computed: {
        url() {
            return this.$route.path;
        }
    }
}
</script>

<style scoped lang="less">
.error-container {
    margin: 3rem 1rem;
    text-align: center;
}

.url-text {
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;

    font-size: 120%;
}

</style>
