import {Module} from 'vuex';
import {TimetableData, TimetableHelpers, WebTimetableData} from "@/lib/data/timetable";
import {NetworkRequest, RequestResponse} from "@/lib/networkRequest";
import {DateParser} from "@/lib/dates/dateParser";

const TT = 'https://spider.scotscollege.school.nz/Spider2011/Handlers/Timetable.asmx/GetTimeTable_ByStudentMode';

function cleanData({data, date}: { data: WebTimetableData, date: string }): WebTimetableData {
    data = data.filter(d => {
        return DateParser.instance(d.Date, DateParser.TT_FORMAT).isAfter(DateParser.instance(date, DateParser.COMMON_FORMAT))
    });
    return data;
}

export const timetable: Module<any, any> = {
    namespaced: true,
    state: {
        timetable: {} as TimetableData,
        error: '' as string,
        isLoading: false,
    },
    getters: {
        timetable(state) {
            return state.timetable;
        }
    },
    mutations: {
        setIsLoading(state, {isLoading}: { isLoading: boolean }) {
            state.isLoading = isLoading;
        },
        setError(state, {error}: { error: string }) {
            state.error = error;
        },
        setTimetable(state, {data}: { data: TimetableData }) {
            state.error = '';
            state.timetable = data;
        },
    },
    actions: {
        async fetchMoreTimetable(store, {date}: { date: string }) {
            return new Promise<boolean>(async (resolve) => {
                const keycode = store.rootGetters['auth/keycode'];
                const request = NetworkRequest.post({
                    url: TT,
                    data: {
                        StudentKey: keycode,
                        Date: DateParser.ReFormat(date, DateParser.COMMON_FORMAT, DateParser.REQUEST_FORMAT),
                        Mode: "STU"
                    },
                    alias: "fetching additional timetable data"
                });

                const onComplete = (response: RequestResponse) => {
                    if (response.ok) {
                        const data = JSON.parse(response.text).d;
                        store.commit('setTimetable', {
                            data: {...store.state.timetable, ...TimetableHelpers.FromWebData(cleanData({data, date}))}
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
        },
        async fetchTimetable(store, {date}: { date: string }) {
            // a promise for sync purposes
            return new Promise<boolean>(async (resolve) => {
                store.commit('setIsLoading', {isLoading: true});
                // create a request object
                const keycode = store.rootGetters['auth/keycode'];
                const request = NetworkRequest.post({
                    url: TT,
                    data: {
                        StudentKey: keycode,
                        Date: DateParser.ReFormat(date, DateParser.COMMON_FORMAT, DateParser.REQUEST_FORMAT),
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
                            data: TimetableHelpers.FromWebData(cleanData({data, date}))
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
