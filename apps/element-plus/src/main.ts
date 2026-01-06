import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import "@/styles/element/index.scss"
import "@/styles/global.scss"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);

app.use(ElementPlus, {
    locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
