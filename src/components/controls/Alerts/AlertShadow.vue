<template>
    <div class="st-shadow st-shadow--hidden">
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
        }, duration: number): Promise<void> {
            return new Promise<void>(resolve => {
                if (duration >= 0) {  // add duration of timeout
                    const timeout = setTimeout(() => {
                        this.dismissAlert(this.timeouts.indexOf(timeout));
                        return resolve();
                    }, duration);
                    this.timeouts = [...this.timeouts, timeout];
                } else {  // no timeout
                    const id = Date.now();
                    this.timeouts = [...this.timeouts, id];
                    const poll = setInterval(() => {
                        if (!this.timeouts.includes(id)) {
                            clearInterval(poll);
                            return resolve();
                        }
                    }, 1000);
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
            })
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
