import {createStore} from 'vuex'
import {auth} from "@/store/auth";
import {timetable} from "@/store/timetable";
import {WebSettings} from "@/lib/settings";

export default createStore({
    state: {},
    mutations: {},
    actions: {
        init(store, {settings}: { settings: WebSettings }) {
            const name = settings.getSetting('user-name');
            store.dispatch('auth/init', {name});
        }
    },
    modules: {
        auth,
        timetable,
    }
})
