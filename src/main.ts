import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import shadow from './lib/plugins/shadow'

const app = createApp(App)
    .use(store)
    .use(router)
    .use(shadow)
    .mount('#app');

(store as any).$app = app;
