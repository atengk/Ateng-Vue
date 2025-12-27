// src/router/routes/index.ts
import staticRoutes from './static'
import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    ...staticRoutes,
    //...dynamicRoutes
]

export default routes
