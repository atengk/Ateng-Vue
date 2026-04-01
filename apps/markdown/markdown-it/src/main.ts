import { createApp } from 'vue'
import App from './App.vue'
// import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown-light.css'
import '@/styles/markdown.css'

const app = createApp(App);

app.mount('#app')
