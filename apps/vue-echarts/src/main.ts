import { createApp } from 'vue'
import App from './App.vue'
/** 注册 ECharts 模块 */
import "@/plugins/echarts";

const app = createApp(App);

app.mount('#app')
