import {Module} from "vuex";

export const online: Module<any, any> = {
    namespaced: true,
    state: {
        isOnline: true
    },
    getters: {
        isOnline(state) {
            return state.isOnline;
        }
    },
    mutations: {
        setStatus(state, {isOnline}: { isOnline: boolean }) {
            state.isOnline = isOnline;
        }
    },
    actions: {
        init(store) {
            // no need to unregister, as the store lasts through router
            window.addEventListener('online', () => {
                store.commit('setStatus', {isOnline: true});
            });
            window.addEventListener('offline', () => {
                store.commit('setStatus', {isOnline: false});
            });

            // initial status
            store.commit('setStatus', {isOnline: window.navigator.onLine});
        }
    }
}
