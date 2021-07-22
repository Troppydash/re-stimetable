<template>
    <div class="st-alert">
        <div class="st-alert__dismiss" @click="onDismiss"><span><i class="ri-close-line"></i></span></div>
        <div v-if="title" class="st-alert__title">
            <span class="st-text st-text--120">{{ title }}</span>
        </div>
        <div class="st-alert__body">
            <slot/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";


export default defineComponent({
    name: "Alert",
    props: ["onDismiss", "timeout", "onTimeout", "title"],
    mounted() {
        if (this.timeout) {
            setTimeout(() => {
                if (this.onTimeout) {
                    this.onTimeout();
                } else if (this.onDismiss) {
                    this.onDismiss();
                }
            }, this.timeout);
        }
    }
});
</script>

<style lang="less">
@import "../../../css/alert";
</style>
