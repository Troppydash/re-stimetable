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
    },
    {
        path :'/:pathMatch(.*)*',
        name: 'Not Found',
        component: () => import("../views/404.vue")
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    if (typeof to.name === "string") {
        document.title = `Scots Timetable | ${to.name}`;
    }
    next();
});

export default router
