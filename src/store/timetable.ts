import {Module} from 'vuex';
import {TimetableData} from "@/lib/data/timetable";
import {NetworkRequest, RequestResponse} from "@/lib/networkRequest";

const TT = 'https://spider.scotscollege.school.nz/Spider2011/Handlers/Timetable.asmx/GetTimeTable_ByStudentMode';

export const timetable: Module<any, any> = {
    namespaced: true,
    state: {
        timetable: [] as TimetableData,
        error: '' as string,
        isLoading: false
    },
    mutations: {
        setIsLoading(state, {isLoading}: {isLoading: boolean}) {
            state.isLoading = isLoading;
        },
        setError(state, {error}: {error: string}) {
            state.error = error;
        },
        setTimetable(state, data: {data: TimetableData}) {
            state.timetable = data;
        }
    },
    actions: {
        async fetchTimetable(store, {date}: { date?: string }) {
            // TODO: Write this;
            const keycode = store.getters['keycode'];
            const request = NetworkRequest.post({
                url: TT,
                data: {
                    StudentKey: keycode,
                    Date: date,
                    Mode: "STU"
                },
                alias: "fetching timetable data"
            });

            const onComplete = (response: RequestResponse) => {
                if (response.ok) {
                    const data = JSON.parse(response.text).d;
                    store.commit('setTimetable', {
                        data
                    });
                }
            }

            const response: RequestResponse = await store.dispatch('networkCall', {
                request,
            });
            request.setOnComplete(onComplete)(response);
        }
    }
}
