import { createApp } from 'vue'
import App from './App.vue'
import Simplebar from 'simplebar-vue'

// SimpleBar 样式
import 'simplebar-vue/dist/simplebar.min.css'

const app = createApp(App);
app.component('Simplebar', Simplebar)

app.mount('#app')
