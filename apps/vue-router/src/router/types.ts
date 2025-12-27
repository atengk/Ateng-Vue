// src/router/types.ts
export interface BackendRoute {
    name: string
    path: string
    component: string
    meta: {
        title: string
        icon?: string
        requiresAuth?: boolean
        requiresPermission?: boolean
        permission?: string
        keepAlive?: boolean
        hidden?: boolean
        order?: number
    }
    children?: BackendRoute[]
}

/**
 * 菜单项类型定义
 * 用于侧边栏 / 顶部菜单等
 */
export interface MenuItem {
    /**
     * 菜单标题
     * 来源：route.meta.title
     */
    title: string

    /**
     * 菜单图标
     * 来源：route.meta.icon
     */
    icon?: string

    /**
     * 路由路径
     */
    path: string

    /**
     * 子菜单
     */
    children: MenuItem[]
}

export interface TabItem {
    name: string
    title: string
    path: string
    keepAlive?: boolean
    affix?: boolean
}