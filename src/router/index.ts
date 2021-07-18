import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Showcase from '../views/Showcase.vue';
import Timetable from '../views/Timetable.vue';
import Settings from '../views/Settings.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Showcase',
        component: Showcase
    },
    {
        path: '/timetable',
        name: 'Timetable',
        component: Timetable
    },
    {
        path: '/settings',
        name: "Settings",
        component: Settings
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});


export default router
