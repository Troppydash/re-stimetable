import {Module} from 'vuex';
import {WebSettings} from "@/lib/settings";
import {NetworkRequest, RequestResponse} from "@/lib/networkRequest";
const SERVER = 'https://dry-sierra-69491.herokuapp.com';

export const auth: Module<any, any> = {
    namespaced: true,
    state: {
        name: '',
        keycode: '',
    },
    getters: {
        keycode(state) {
            return state.keycode;
        },
        auth(state) {
            return state;
        }
    },
    mutations: {
        setAuth(state, {name, keycode}: { name: string, keycode: string }) {
            state.name = name;
            state.keycode = keycode;
        },
        setKeycode(state, {keycode}: { keycode: string }) {
            state.keycode = keycode;
        }
    },
    actions: {
        init(store, {settings}: { settings: WebSettings }) {
            const user = settings.getSetting('user');
            store.commit('setAuth', {
                name: user.name,
                keycode: user.keycode
            });
        },
        updateAuth(store, {name, keycode}: { name: string, keycode: string }) {
            WebSettings.instance.setSetting('user', {
                name,
                keycode,
            });
            store.commit('setAuth', {
                name,
                keycode
            });
        },
        setupKeycode(store, {barcode, fname, lname, mname, email}: any): Promise<[string, boolean]> {
            return new Promise<[string, boolean]>(async (resolve) => {
                const request = NetworkRequest.post({
                    url: SERVER + '/calibrate',
                    data: {
                        barcode,
                        fname,
                        lname,
                        mname,
                        email
                    },
                    alias: "retrieving usable keycode"
                });

                const onComplete = (response: RequestResponse) => {
                    if (response.ok) {
                        const data = JSON.parse(response.text);
                        if (data.error) {
                            return resolve([data.text, false]);
                        }
                        store.commit('setKeycode', {keycode: data.text});
                        store.dispatch('updateAuth', {name: store.state.name, keycode: data.text});
                        return resolve(['', true]);
                    }

                    try {
                        return resolve([JSON.parse(response.text).text, false]);
                    } catch (_) {
                        return resolve([response.text, false]);
                    }
                }

                const response: RequestResponse = await store.dispatch('network/networkCall', {
                    request,
                }, {root: true});
                request.setOnComplete(onComplete)(response);
            })
        }
    }
}
