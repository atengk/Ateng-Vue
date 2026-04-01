import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {setupDirectives} from "./directives";


const app = createApp(App)

setupDirectives(app)

app.mount('#app')
