// router/index.ts
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('@/views/dashboard/index.vue')
            },
            {
                path: 'system',
                component: () => import('@/views/system/index.vue')
            }
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})