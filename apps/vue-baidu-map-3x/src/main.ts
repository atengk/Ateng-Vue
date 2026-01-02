import { createApp } from 'vue'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map-3x'

const app = createApp(App);

app.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: '9Q8qaaT7v806V3OqDNeYtIuACfrA4CM5',
    // v:'2.0',  // 默认使用3.0
    // type: 'WebGL' // ||API 默认API  (使用此模式 BMap=BMapGL)
});

app.mount('#app')
