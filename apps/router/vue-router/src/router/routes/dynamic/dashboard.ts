// // src/router/routes/dynamic/dashboard.ts
// import type { RouteRecordRaw } from 'vue-router'
//
// const dashboardRoutes: RouteRecordRaw = {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: () => import('@/layout/index.vue'), // 基础布局
//     meta: {
//         title: '工作台',
//         requiresAuth: true
//     },
//     children: [
//         {
//             path: '', // 默认子路由
//             name: 'DashboardHome',
//             component: () => import('@/views/dashboard/index.vue'),
//             meta: { title: '首页', requiresAuth: true }
//         },
//         {
//             path: 'stats',
//             name: 'DashboardStats',
//             component: () => import('@/views/dashboard/Stats.vue'),
//             meta: { title: '统计', requiresAuth: true }
//         }
//     ]
// }
//
// export default [dashboardRoutes]
