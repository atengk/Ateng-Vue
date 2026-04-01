import { createApp } from 'vue'
import App from './App.vue'
import AntdvNext from 'antdv-next'

const app = createApp(App);

app.use(AntdvNext)

app.mount('#app')
