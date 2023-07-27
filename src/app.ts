/* eslint-disable @typescript-eslint/no-unused-expressions */
// 运行时配置
import React from 'react';
import { AliveScope } from 'react-activation';
// import { initGoBackAction } from './utils/hybrid';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'oss-lichong' };
}

// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     menu: {
//       locale: false,
//     },
//   };
// };
// 处理过的request
export { requestConfig as request } from '@/utils/request';
// keepalive，如果想要使用ka，必须在入口处添加
export function rootContainer(container: any) {
  return React.createElement(AliveScope, null, container);
}
// console.log(REACT_APP_ENV, 'REACT_APP_ENV', process.env);
// REACT_APP_ENV !== 'prod' ? new VConsole({ theme: 'dark' }) : '';

// initGoBackAction();
//处理返回逻辑，当在第一层时，调用app的返回
// history.back = () => {
//   // 当路由栈空就调用app的返回
//   if (window.history.state.idx === 0) {
//     postMessageToApp(ACTION_POP);
//   } else history.back();
// };
// 友盟埋点
// if (REACT_APP_ENV === 'prod') {
//   require('./utils/BuriedToYM');
// }

// // ARMS性能监测
// if (REACT_APP_ENV === 'prod') {
//   const BrowserLogger = require('alife-logger');
//   BrowserLogger.singleton({
//     pid: 'clt5tab4b0@cc696d55360ab11',
//     appType: 'web',
//     imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?',
//     sendResource: true,
//     enableLinkTrace: true,
//     behavior: true,
//   });
// }
