import type {Router} from 'vue-router'

// import { useUserStore } from '@/store/user'

/**
 * 全局守卫
 * @param router Router 实例
 */
export function setupRouterGuard(router: Router) {
    // const userStore = useUserStore()

    /**
     * 前置守卫
     */
    router.beforeEach(async (to) => {
        // --------------------------
        // 1️⃣ 登录态校验
        // --------------------------
        /*const token = userStore.token
        if (to.meta.requiresAuth && !token) {
            return {
                name: 'Login',
                query: { redirect: to.fullPath }
            }
        }*/

        // --------------------------
        // 2️⃣ 动态路由权限校验
        // --------------------------
        /*if (to.meta.requiresPermission) {
            const hasPerm = userStore.hasPermission(to.meta.permission as string)
            if (!hasPerm) {
                return { name: 'Forbidden' } // 403 页面
            }
        }*/

        // --------------------------
        // 3️⃣ 参数校验
        // --------------------------
        if (to.params.id !== undefined && typeof to.params.id !== 'string') {
            return {name: 'BadRequest'} // 参数错误页
        }

        // --------------------------
        // 4️⃣ 动态路由刷新兜底
        // --------------------------
        /*if (to.name && !router.hasRoute(to.name)) {
            await userStore.loadAsyncRoutes() // 动态路由注入
            return to.fullPath
        }*/

        // --------------------------
        // 5️⃣ 默认放行
        // --------------------------
        return true
    })

    /**
     * 后置守卫
     */
    router.afterEach((to) => {
        // 页面标题设置
        document.title = (to.meta.title as string) || '系统默认标题'
    })

    /**
     * 全局路由加载错误处理
     */
    router.onError((error) => {
        console.error('路由加载失败', error)
        if (error.message.includes('Loading chunk')) {
            location.reload()
        }
    })
}
