import { createApp } from 'vue'
import App from './App.vue'
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'
import { enableKatex, enableMermaid } from 'markstream-vue'

enableMermaid()
enableKatex()
const app = createApp(App);

app.mount('#app')
