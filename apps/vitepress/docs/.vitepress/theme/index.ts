import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AntdvNext from 'antdv-next'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.use(ElementPlus, {
            locale: zhCn,
        })
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
        app.use(AntdvNext)
    }
}