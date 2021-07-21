import {Module} from 'vuex';
import {TimetableData} from "@/lib/data/timetable";

export const timetable: Module<any, any> = {
    namespaced: true,
    state: {
        timetable: [] as TimetableData,
        error: '' as string,
        isLoading: false
    },
    mutations: {},
    actions: {
        fetchTimetable(store, {date}: { date?: string }) {
            // TODO: Write this;
        }
    }
}
