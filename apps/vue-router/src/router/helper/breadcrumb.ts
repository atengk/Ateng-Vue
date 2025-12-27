// src/router/helper/breadcrumb.ts
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface BreadcrumbItem {
    title: string
    path: string
}

export function generateBreadcrumbs(
    route: RouteLocationNormalizedLoaded
): BreadcrumbItem[] {
    return route.matched
        .filter(r => r.meta?.title && r.meta.breadcrumb !== false)
        .map(r => ({
            title: r.meta.title as string,
            path: r.path
        }))
}