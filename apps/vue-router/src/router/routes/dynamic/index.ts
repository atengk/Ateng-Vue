// src/router/routes/dynamic/index.ts
import dashboardRoutes from './dashboard'
import systemRoutes from './system'
import reportRoutes from './report'
import type { RouteRecordRaw } from 'vue-router'

const dynamicRoutes: RouteRecordRaw[] = [
    ...dashboardRoutes,
    ...systemRoutes,
    ...reportRoutes
]

export default dynamicRoutes
