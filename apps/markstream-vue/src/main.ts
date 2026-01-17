import {createApp} from 'vue'
import App from './App.vue'
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'

import {enableKatex, enableMermaid, setDefaultI18nMap} from 'markstream-vue'

enableMermaid()
enableKatex()

setDefaultI18nMap({
    'common.copy': '复制',
    'common.copySuccess': '已复制',
    'common.decrease': '减少',
    'common.reset': '重置',
    'common.increase': '增加',
    'common.expand': '展开',
    'common.collapse': '折叠',
    'common.preview': '预览',
    'common.source': '源代码',
    'common.export': '导出',
    'common.open': '打开',
    'common.zoomIn': '放大',
    'common.zoomOut': '缩小',
    'common.resetZoom': '重置缩放',
    'image.loadError': '图片加载失败',
    'image.loading': '正在加载图片...',
})

const app = createApp(App);

app.mount('#app')
