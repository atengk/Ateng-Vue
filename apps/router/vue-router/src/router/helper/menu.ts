// src/router/helper/menu.ts
import type {RouteRecordRaw} from 'vue-router'
import type {MenuItem} from '@/router/types'

/**
 * 根据路由配置生成菜单结构
 */
export function generateMenus(
    routes: readonly RouteRecordRaw[]
): MenuItem[] {
    return routes
        .filter(route => !route.meta?.hidden && route.meta?.title)
        .sort(
            (a, b) =>
                Number(a.meta?.order ?? 0) -
                Number(b.meta?.order ?? 0)
        )
        .map(route => {
            const menu: MenuItem = {
                title: String(route.meta?.title),
                icon: route.meta?.icon as string | undefined,
                path: route.path,
                children: []
            }

            if (route.children?.length) {
                menu.children = generateMenus(route.children)
            }

            return menu
        })
}