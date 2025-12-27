// src/router/helper/transform.ts
import type { RouteRecordRaw } from 'vue-router'
import type { BackendRoute } from '../types'
import { loadComponent } from './loadComponent'

export function transformRoutes(
    routes: BackendRoute[]
): RouteRecordRaw[] {
    return routes.map(route => {
        const record: RouteRecordRaw = {
            name: route.name,
            path: route.path,
            component: loadComponent(route.component),
            meta: route.meta,
            children: route.children?.length
                ? transformRoutes(route.children)
                : undefined
        }

        return record
    })
}
