import { createApp } from 'vue'
import App from './App.vue'
import { printPlugin } from 'vue-print-next'

const app = createApp(App);
app.use(printPlugin)

app.mount('#app')
