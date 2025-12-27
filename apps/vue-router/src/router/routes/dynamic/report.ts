// // src/router/routes/dynamic/report.ts
// import type { RouteRecordRaw } from 'vue-router'
//
// const reportRoutes: RouteRecordRaw = {
//     path: '/report',
//     name: 'Report',
//     component: () => import('@/layout/index.vue'),
//     meta: { title: '报表中心', requiresAuth: true },
//     children: [
//         {
//             path: 'sales',
//             name: 'SalesReport',
//             component: () => import('@/views/report/Sales.vue'),
//             meta: {
//                 title: '销售报表',
//                 requiresAuth: true,
//                 requiresPermission: true,
//                 permission: 'report:sales'
//             }
//         },
//         {
//             path: 'finance',
//             name: 'FinanceReport',
//             component: () => import('@/views/report/Finance.vue'),
//             meta: {
//                 title: '财务报表',
//                 requiresAuth: true,
//                 requiresPermission: true,
//                 permission: 'report:finance'
//             }
//         }
//     ]
// }
//
// export default [reportRoutes]
