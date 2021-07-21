import {Module} from 'vuex';

export const auth: Module<any, any> = {
    namespaced: true,
    state: {
        name: '',
        keycode: '',
        realName: '',
    },
    getters: {
        keycode(state) {
            return state.keycode;
        },
    },
    mutations: {
        setAuth(state, {name, keycode}: { name: string, keycode: string }) {
            state.name = name;
            state.keycode = keycode;
        }
    },
    actions: {
        init(store, {user}: {user: any}) {
            store.commit('setAuth', {
                name: user.name,
                keycode: user.keycode
            });
        }
    }
}
