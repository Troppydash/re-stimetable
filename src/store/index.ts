import {createStore} from 'vuex'
import {auth} from "@/store/auth";
import {timetable} from "@/store/timetable";
import {WebSettings} from "@/lib/settings";
import {online} from "@/store/online";
import {NetworkRequest, RequestResponse} from "@/lib/networkRequest";

export default createStore({
    state: {
        network: {
            uncalled: [] as NetworkRequest[],
            isCalling: false
        }
    },
    getters: {
        haveUncalled(state) {
            return state.network.uncalled.length > 0;
        }
    },
    mutations: {
        popUncalled(state, _) {
            state.network.uncalled.splice(0, 1);
        },
        pushUncalled(state, {request}) {
            state.network.uncalled = [...state.network.uncalled, request];
        },
        setIsCalling(state, {isCalling}) {
            state.network.isCalling = isCalling;
        }
    },
    actions: {
        async callAllUncalled(store) {
            const uncalled = [...store.state.network.uncalled];
            store.commit('setIsCalling', {isCalling: true});
            for (let i = 0; i < uncalled.length; i++) {
                const call = uncalled[i];
                store.commit('popUncalled');
                const response = await store.dispatch('networkCall', {
                    request: call,
                    catchup: true,
                });
                call.onComplete(response);
            }
            store.commit('setIsCalling', {isCalling: false});
        },
        async networkCall(store, {
            request,
            catchup,
        }: { request: NetworkRequest, catchup?: boolean }): Promise<RequestResponse> {
            if (!catchup && store.getters['haveUncalled']) {
                // wait for uncalled to clear
                await new Promise(resolve => {
                    let tries = 0;
                    setInterval(() => {
                        if (store.getters['haveUncalled']) {
                            return resolve(null);
                        }
                        tries += 1;
                        if (tries > 50) {
                            (this as any).$app.$shadow.evoke('showAlert', {
                                title: 'Network',
                                text: `Lock on requests are not released after 5s, continuing`
                            });
                            return resolve(null);
                        }
                    }, 100);
                })
            }

            const response = await request.send();
            if (!response.ok && !store.getters['online/isOnline']) {
                store.commit('pushUncalled', {request});
                (this as any).$app.$shadow.evoke('showAlert', {
                    title: 'Network',
                    text: `Failed to '${request.alias ?? 'contact the server'}', will retry when online`
                });
            }
            return response;
        },
        init(store, {settings}: { settings: WebSettings }) {
            const user = settings.getSetting('user');
            store.dispatch('auth/init', {user});

            // online and offline
            store.dispatch('online/init', {
                onStateChange: (isOnline: boolean) => {
                    if (isOnline && store.getters['haveUncalled']) {
                        store.dispatch('callAllUncalled');
                    }
                }
            });
        }
    },

    modules: {
        auth,
        timetable,
        online,
    }
})
