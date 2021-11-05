<template>
    <div class="expand">
        <div class="expand__header">
            <div class="expand__header--actions">
                <span class="st-text expand__header--action" @click.prevent="toggle">
                    {{ text }}:
                </span>
            </div>
        </div>
        <div class="expand__body" v-show="expanded">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "expand",
    props: {
        text: {
            type: String,
            default: "Advanced"
        }
    },
    data() {
        return {
            expanded: false
        }
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        }
    }
}
</script>

<style scoped lang="less">

.expand {
    margin: 0.25rem 0;
}

.expand__header--actions {
    margin: 0.25rem 0;
}

.expand__header--action {
    background: none;
    border: none;
    cursor: pointer;
}

.expand__header--action:hover {
    text-decoration: underline;
}

.expand__header--action:active {
    position: relative;
    top: 1px;
}

</style>
