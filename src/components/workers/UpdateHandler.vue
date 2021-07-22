<template>

</template>

<script>
import {SW_UPDATED} from "@/registerServiceWorker";

export default {
    name: "UpdateHandler",
    data() {
        return {
            registration: null,
            isRefreshing: false,
        }
    },
    methods: {
        handleUpdate(event) {
            this.registration = event.detail;
            if (!this.registration || !this.registration.waiting) return;
            this.$shadow.evoke('showAlert', {
                title: 'New Update',
                text: 'This page will refresh in the next three seconds'
            });
            setTimeout(() => {
                this.registration.waiting.postMessage({
                    type: 'SKIP_WAITING'
                });
            }, 3000);
        }
    },
    created() {
        document.addEventListener(SW_UPDATED, this.handleUpdate, {once: true});

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (this.isRefreshing) return;
            this.isRefreshing = true;
            window.location.reload(true);
        });
    }
}
</script>

<style scoped>

</style>
