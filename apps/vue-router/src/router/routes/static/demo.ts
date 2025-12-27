// src/router/routes/static/demo.ts
import type { RouteRecordRaw } from 'vue-router'

const demoRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: {
            name: 'Home',
        }
    },
    {
        name: 'Home',
        path: '/home',
        component: () => import('@/views/Home.vue')
    },
    {
        name: 'About',
        path: '/about',
        component: () => import('@/views/About.vue')
    },
    {
        name: 'Detail',
        path: '/detail',
        component: () => import('@/views/Detail.vue')
    },
    {
        name: 'DetailById',
        path: '/detail/:id',
        component: () => import('@/views/DetailById.vue'),
        beforeEnter: (to) => {
            const {id} = to.params

            if (typeof id !== 'string') {
                return {name: 'Detail'}
            }

            const isNumber = /^\d+$/.test(id)
            if (!isNumber) {
                return {name: 'Detail'}
            }

            return true
        }
    },
    {
        name: 'Route',
        path: '/route/:id',
        component: () => import('@/views/Route.vue'),
        meta: {
            title: '详情页',
            requireAuth: true,
            showBack: true
        }
    },
    {
        path: '/route/child',
        component: () => import('@/views/Route.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/NotFound.vue')
    },
    {
        path: '/403',
        name: 'Forbidden',
        component: () => import('@/views/error/Forbidden.vue')
    },
    {
        path: '/401',
        name: 'Unauthorized',
        component: () => import('@/views/error/Unauthorized.vue')
    },
    {
        path: '/500',
        name: 'ServerError',
        component: () => import('@/views/error/ServerError.vue')
    }
]

export default demoRoutes