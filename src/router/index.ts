import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Showcase',
        component: () => import("../views/Showcase.vue")
    },
    {
        path: '/timetable',
        name: 'Timetable',
        component: () => import("../views/Timetable.vue")
    },
    {
        path: '/settings',
        name: "Settings",
        component: () => import("../views/Settings.vue")
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});


export default router
