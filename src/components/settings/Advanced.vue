<template>
    <div class="advanced">
        <p class="st-text st-text--header">Advanced Operations</p>
        <div class="st-section">
            <p class="st-text st-text--section st-section__title">Reset All Configurations</p>
            <p class="st-text">Important! This will remove all your settings on this website</p>
            <br/>
            <button class="st-button st-button--primary" @click="resetAll">Reset All</button>
        </div>
    </div>
</template>

<script>
import {WebSettings} from "@/lib/settings";
import alerts from "@/lib/mixins/alerts";

export default {
    name: "Advanced",
    mixins: [alerts],
    methods: {
        resetAll() {
            WebSettings.instance.clear();
            this.alert({
                title: 'Success',
                text: 'This page will refresh in three seconds'
            }, 3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../css/addons";
</style>
