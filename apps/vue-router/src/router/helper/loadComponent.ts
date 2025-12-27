// src/router/helper/loadComponent.ts
import Layout from '@/layout/index.vue'
import type { Component } from 'vue'

/**
 * 自动加载 views 下的所有页面
 */
const viewModules = import.meta.glob('@/views/**/*.vue')

export function loadComponent(component: string): Component {
    if (component === 'layout') {
        return Layout
    }

    const path = `/src/views/${component}.vue`
    const loader = viewModules[path]

    if (!loader) {
        throw new Error(`组件不存在: ${path}`)
    }

    return loader
}