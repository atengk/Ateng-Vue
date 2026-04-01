// src/router/index.ts
import {createRouter, createWebHistory} from 'vue-router'
import {setupRouterGuard} from "./guard/permission";
import routes from './routes' // 静态 + 动态总汇


const router = createRouter({
    history: createWebHistory(),
    routes
})

// 注册全局守卫
setupRouterGuard(router)

export default router