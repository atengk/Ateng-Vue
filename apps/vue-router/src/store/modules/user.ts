// src/store/modules/user.ts
import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {RouteRecordName} from 'vue-router'
import router from '@/router'
import {transformRoutes} from '@/router/helper/transform'
import type {BackendRoute} from '@/router/types'

export const useUserStore = defineStore('user', () => {
    /**
     * 登录凭证
     */
    const token = ref<string>('')

    /**
     * 动态路由是否已加载
     */
    const routesLoaded = ref<boolean>(false)

    /**
     * 已动态注入的路由 name 列表
     * 用于卸载
     */
    const addedRouteNames = ref<NonNullable<RouteRecordName>[]>([])

    /**
     * 加载并动态注入后端路由
     */
    async function loadAsyncRoutes() {
        if (routesLoaded.value) return

        // 1. 请求后端路由数据
        const res: BackendRoute[] = await fetchUserRoutes()

        // 2. 转换为 Vue Router 路由
        const routes = transformRoutes(res)

        // 3. 动态注入并记录 name
        routes.forEach(route => {
            router.addRoute(route)

            if (route.name) {
                addedRouteNames.value.push(route.name)
            }
        })

        routesLoaded.value = true
    }

    /**
     * 卸载所有动态路由
     * （退出登录 / 切换角色 / 权限变化）
     */
    function resetDynamicRoutes() {
        addedRouteNames.value.forEach(name => {
            if (router.hasRoute(name)) {
                router.removeRoute(name)
            }
        })

        addedRouteNames.value = []
        routesLoaded.value = false
    }

    return {
        token,
        routesLoaded,
        addedRouteNames,
        loadAsyncRoutes,
        resetDynamicRoutes
    }
})

// ----------------------------------
// 模拟后端接口
// ----------------------------------
async function fetchUserRoutes(): Promise<BackendRoute[]> {
    return Promise.resolve([
        {
            name: 'Dashboard',
            path: '/dashboard',
            component: 'layout',
            meta: {
                title: '工作台',
                icon: 'home',
                requiresAuth: true,
                order: 1
            },
            children: [
                {
                    name: 'DashboardHome',
                    path: '',
                    component: 'dashboard/index',
                    meta: {
                        title: '首页',
                        requiresAuth: true,
                        keepAlive: true
                    }
                }
            ]
        }
    ])
}