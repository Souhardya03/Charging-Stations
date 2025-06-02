import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'
const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  },
})
app.use(Vue3Toastify, {
  autoClose: 3000,
});
app.mount('#app')
