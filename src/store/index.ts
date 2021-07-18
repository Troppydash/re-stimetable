import {createStore} from 'vuex'

export default createStore({
    state: {
        auth: {
            username: '',
            error: '',
        },

        timetable: {
            isLoading: false,
            data: [],
            error: ''
        },


    },
    mutations: {},
    actions: {},
    modules: {}
})
