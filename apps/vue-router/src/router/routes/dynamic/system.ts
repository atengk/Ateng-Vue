// // src/router/routes/dynamic/system.ts
// import type { RouteRecordRaw } from 'vue-router'
//
// const systemRoutes: RouteRecordRaw = {
//     path: '/system',
//     name: 'System',
//     component: () => import('@/layout/index.vue'),
//     meta: { title: '系统管理', requiresAuth: true },
//     children: [
//         {
//             path: 'user',
//             name: 'SystemUser',
//             component: () => import('@/views/system/User.vue'),
//             meta: {
//                 title: '用户管理',
//                 requiresAuth: true,
//                 requiresPermission: true,
//                 permission: 'system:user'
//             }
//         },
//         {
//             path: 'role',
//             name: 'SystemRole',
//             component: () => import('@/views/system/Role.vue'),
//             meta: {
//                 title: '角色管理',
//                 requiresAuth: true,
//                 requiresPermission: true,
//                 permission: 'system:role'
//             }
//         }
//     ]
// }
//
// export default [systemRoutes]
