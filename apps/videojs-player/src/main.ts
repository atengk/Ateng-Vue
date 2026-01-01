import { createApp } from 'vue'
import App from './App.vue'

// 引入 Video.js 样式
import 'video.js/dist/video-js.css';

// 引入插件
import VueVideoPlayer from '@videojs-player/vue';

const app = createApp(App);

// 安装插件（全局组件 VideoPlayer 可用）
app.use(VueVideoPlayer);

app.mount('#app')