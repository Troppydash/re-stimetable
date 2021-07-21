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
    mutations: {
        addUncalled(state, {request}) {
            state.network.uncalled = [...state.network.uncalled, request];
        },
        setIsCalling(state, {isCalling}) {
            state.network.isCalling = isCalling;
        }
    },
    actions: {
        async networkCall(store, {request}: {request: NetworkRequest}): Promise<RequestResponse> {
            const response = await request.send();
            if (!response.ok && !store.getters['online/isOnline']) {
                store.commit('addUncalled', { request });
            }
            return response;
        },
        init(store, {settings}: { settings: WebSettings }) {
            const name = settings.getSetting('user-name');
            store.dispatch('auth/init', {name});

            // online and offline
            store.dispatch('online/init');
        }
    },
    modules: {
        auth,
        timetable,
        online,
    }
})
