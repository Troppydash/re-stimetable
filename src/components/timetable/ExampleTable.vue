<template>
    <DynamicTable :package="package"/>
</template>

<script>
import DynamicTable from "./DynamicTable";
import {TimetableHelpers} from "@/lib/data/timetable";

export default {
    name: "ExampleTable",
    components: {DynamicTable},
    data() {
        return {
            data: [],
            isLoading: true,
        }
    },
    computed: {
        package() {
            return {
                data: TimetableHelpers.ToSortedDays(this.data),
                isLoading: this.isLoading,
                error: '',
            }
        }
    },
    async mounted() {
        const response = await fetch('/examples/timetable.json');
        this.data = TimetableHelpers.FromWebData(await response.json());
        this.isLoading = false;
    }
}
</script>

<style scoped>

</style>
