import { createApp } from 'vue'
import App from './App.vue'
import Vue3Signature from "vue3-signature";

const app = createApp(App);

app.use(Vue3Signature);

app.mount('#app')
