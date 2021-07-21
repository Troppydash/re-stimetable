<template>
    <div>
        <Dialog :is-open="false">
            <h1>Hello</h1>
        </Dialog>
    </div>
</template>

<script>
import Dialog from "@/components/controls/Dialogs/Dialog";
export default {
    name: 'Showcase',
    components: {Dialog},
    methods: {

    },
    mounted() {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                this.$shadow.evoke("showAlert", {text: "Hello World" + i, title: "A Title" + i});
            }, 1000 * i);
        }

    }
}
</script>

<style scoped>

</style>
