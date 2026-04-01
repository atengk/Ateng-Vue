import { createApp } from 'vue'
import App from './App.vue'

import { useUmoEditor } from '@umoteam/editor'

const app = createApp(App)

app.use(useUmoEditor, {
})

app.mount('#app')
