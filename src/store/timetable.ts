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
        setIsLoading(state, {isLoading}: { isLoading: boolean }) {
            state.isLoading = isLoading;
        },
        setError(state, {error}: { error: string }) {
            state.error = error;
        },
        setTimetable(state, data: { data: TimetableData }) {
            state.error = '';
            state.timetable = data;
        }
    },
    actions: {
        async fetchTimetable(store, {date}: { date: string | undefined }) {
            // a promise for sync purposes
            return new Promise<boolean>(async (resolve) => {
                store.commit('setIsLoading', {isLoading: true});
                // create a request object
                const keycode = store.rootGetters['auth/keycode'];
                const request = NetworkRequest.post({
                    url: TT,
                    data: {
                        StudentKey: keycode,
                        Date: date ?? '21/09/2021',
                        Mode: "STU"
                    },
                    alias: "fetching timetable data"
                });

                // complete handler, resolves if all done
                const onComplete = (response: RequestResponse) => {
                    store.commit('setIsLoading', {isLoading: false});

                    if (response.ok) {
                        const data = JSON.parse(response.text).d;
                        store.commit('setTimetable', {
                            data
                        });
                    } else {
                        store.commit('setError', {
                            error: response.text
                        });
                    }
                    return resolve(true);
                }

                // send the response and call the handler
                const response: RequestResponse = await store.dispatch('network/networkCall', {
                    request,
                }, {root: true});
                request.setOnComplete(onComplete)(response);
            })
        }
    }
}
