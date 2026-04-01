import {createApp} from 'vue'
import App from './App.vue'
import VueUeditorWrap from 'vue-ueditor-wrap';

const app = createApp(App);

app.use(VueUeditorWrap)

app.mount('#app')
