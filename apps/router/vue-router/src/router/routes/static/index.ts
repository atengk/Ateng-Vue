// src/router/routes/static/index.ts
import demoRoutes from './demo'
import type {RouteRecordRaw} from 'vue-router'

const staticRoutes: RouteRecordRaw[] = [
    ...demoRoutes
]

export default staticRoutes
