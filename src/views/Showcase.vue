<template>
    <div class="showcase">
        <div class="showcase__header">
            <h1 class="st-text st-text--400">STimetable</h1>
            <h5 class="st-text st-text--120">A Timetable Management Website</h5>
        </div>
        <div>
            <p class="st-text">It contains...</p>
        </div>
        <div>
            <a class="st-text st-text--title st-text--link">Your Timetable</a>
            <p class="st-text st-text--90">- note that this is not your actual timetable, it is an example</p>
        </div>
        <div class="showcase__table">
            <ExampleTable />
        </div>
        <div>
            <a class="st-text st-text--title st-text--link">And A Map</a>
        </div>
        <div>
            <MapCanvas/>
        </div>
        <div>
            <p class="st-text st-text--title">You can...</p>
        </div>
        <div>
            <p class="st-text">
                Check your timetable without entering them yourself,
                <br/>
                Use powerful queries to select specific periods,
                <br/>
                Visually find where your class is,
                <br/>
                Get started <a class="st-text st-text--link" href="/timetable">here</a>
            </p>
        </div>

    </div>
    <First v-model:is-open="newUser"/>
</template>

<script>
import Dialog from "@/components/controls/Dialogs/Dialog";
import MapCanvas from "@/components/map/MapCanvas";
import DynamicTable from "@/components/timetable/DynamicTable";
import ExampleTable from "@/components/timetable/ExampleTable";
import {WebSettings} from "../lib/settings";
import First from "../components/first/first";
export default {
    name: 'Showcase',
    components: {First, ExampleTable, DynamicTable, MapCanvas, Dialog},
    data() {
        return {
            newUser: false,
        }
    },
    mounted() {
        const settings = WebSettings.instance;
        if (!settings.getSetting("user").visited) {
            // open setup dialog
            this.newUser = true;
        }
    }
}
</script>

<style lang="less" scoped>

.showcase {
    max-width: 1300px;
    margin: 0 auto;
    padding: 2rem 2rem;

    overflow: hidden;

    .showcase__header {
        text-align: center;
        margin-bottom: 2rem;
    }

    & > div {
        margin-bottom: 1rem;
    }
}

@media screen and (max-width: 1024px) {
    .showcase {
        padding: 1rem;
        margin: 0 auto;

        .showcase__table {
            height: 600px;
            display: flex;
        }
    }
}


</style>
