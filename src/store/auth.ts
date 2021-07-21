import {Module} from 'vuex';

export const auth: Module<any, any> = {
    namespaced: true,
    state: {
        name: '',
        keycode: '',
        realName: '',
    },
    mutations: {
        setAuth(state, {username}: { username: string }) {
            state.username = username;
        }
    },
    actions: {
        init(store, {name}) {
            store.commit('setAuth', {
                username: name
            });
        }
    }
}
