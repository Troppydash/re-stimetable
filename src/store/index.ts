import {createStore} from 'vuex'
import {auth} from "@/store/auth";
import {timetable} from "@/store/timetable";
import {WebSettings} from "@/lib/settings";
import {online} from "@/store/online";
import {network} from "@/store/network";

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {
        init(store, {settings}: { settings: WebSettings }) {
            store.dispatch('auth/init', {settings});

            // online and offline
            store.dispatch('online/init', {
                onStateChange: (isOnline: boolean) => {
                    if (isOnline && store.getters['network/haveUncalled']) {
                        store.dispatch('network/callAllUncalled');
                    }
                }
            });
        }
    },

    modules: {
        auth,
        timetable,
        online,
        network,
    }
})
