<template>
    <div v-show="isOpen" class="st-shadow st-shadow--darken" @click.stop="onClose">
        <div class="st-dialog" @click.stop>
            <div class="st-dialog__header">
                <p class="st-text st-text--title">{{ title ?? 'Dialog Title' }}</p>
            </div>
            <div class="st-dialog__body">
                <slot/>
            </div>
            <div class="st-dialog__footer">
                <button class="st-button st-button--primary st-button--fill"
                        @click="onOption1">
                    {{ option1 ?? "Continue" }}
                </button>
                <button class="st-button"
                        @click="onOption2">
                    {{ option2 ?? "Discard" }}
                </button>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "Dialog",
    props: ["isOpen", "title", "option1", "option2", "onClose", "onOption1", "onOption2"],
}
</script>

<style lang="less">

@import "../../../css/dialog";

</style>
