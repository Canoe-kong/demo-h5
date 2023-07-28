// 不使用约束型路由,因为有额外的参数，比如keepAlive，所以需要设置routes
// 可以通过useSelectedRoutes 来获取这个routes
// 再这对每个路由界面加字段数据来特殊使用

import { Routes } from 'typings';

/**
 * redirect，static路由被占用了，不要用这个建routes
 */
export default [
  // exact 表示是否严格匹配 routes表示子路由 redirect：配置路由跳转
  {
    path: '/404',
    component: '@/pages/error/404',
    title: '404',
  },
  {
    path: '/403',
    component: '@/pages/error/403',
    title: '403',
  },
  {
    path: '/',
    wrappers: ['@/wrappers/auth'],
    component: '@/pages/layouts',
    // redirect: '/network',
    // title: '立充',
    routes: [],
  },
] as Routes[];
