<template>
    <div class="st-shadow">
        <div v-show="alerts.length > 0" class="st-alert__container st-alert__tr">
            <Alert v-for="({ text, title }, index) in alertsReversed"
                   :title="title"
                   :on-dismiss="() => dismissAlert(alerts.length - index - 1)">
                <span>{{ text }}</span>
            </Alert>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Alert from "@/components/controls/Alerts/Alert.vue";

export default defineComponent({
    name: "AlertShadow",
    components: {Alert},
    data() {
        return {
            alerts: [] as {
                text: string,
                title?: string
            }[],
            timeouts: [] as (number | null)[],
        };
    },
    computed: {
        alertsReversed(): any[] {
            const reversed = [...this.alerts];
            return reversed.reverse();
        }
    },
    methods: {
        dismissAlert(index: number) {
            this.alerts.splice(index, 1);

            const code = this.timeouts[index];
            if (code !== null) {
                clearTimeout(code);
            }
            this.timeouts.splice(index, 1);
        },
        showAlert(text: string | {
            text: string,
            title: string
        }, duration: number = 5000) {
            if (duration >= 0) {  // add duration of timeout
                const timeout = setTimeout(() => {
                    this.dismissAlert(this.timeouts.indexOf(timeout));
                }, duration);
                this.timeouts = [...this.timeouts, timeout];
            } else {  // no timeout
                this.timeouts = [...this.timeouts, null];
            }

            if (typeof text === "string") {  // add alert with body
                this.alerts = [...this.alerts, {
                    text
                }]
            } else {  // add alert with title and body
                this.alerts = [...this.alerts, {
                    text: text.text,
                    title: text.title,
                }]
            }
        },

    },
    mounted() {
        (this as any).$shadow.register('showAlert', this.showAlert);
    }
});
</script>

<style lang="less" scoped>

.st-alert__container {
    margin-top: 1rem;

    & > .st-alert + .st-alert {
        margin-top: 1rem;
    }

    &.st-alert__tr {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }
}

</style>
