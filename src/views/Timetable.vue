<template>
    <div class="timetable">
        <DynamicTable/>
    </div>
</template>

<script>
import Alert from "@/components/controls/Alerts/Alert";
import DynamicTable from "@/components/timetable/DynamicTable";
export default {
    name: "Timetable",
    components: {DynamicTable, Alert}
}
</script>

<style lang="less" scoped>

.timetable {
    margin: 0 auto;
    padding: 2rem 2rem;
    width: 70%;
}

@media screen and (max-width: 1024px) {
    .timetable {
        width: 95%;
    }
}

</style>
