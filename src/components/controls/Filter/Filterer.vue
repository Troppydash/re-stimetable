<template>
    <div class="filterer">
        <div class="filterer__input">
            <input class="st-input" placeholder="select * from ..."
                   style="width: 500px"
                   v-model="query"/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {PromiseHelpers} from "@/lib/promise/common";

export default defineComponent({
    name: "Filterer",
    props: ['filter'],
    data() {
        return {
            query: ''
        };
    },
    watch: {
        query: PromiseHelpers.Debounce((newQuery: string) => {
            console.log(newQuery);
        }, 1000)
    }
})
</script>

<style scoped>

</style>
