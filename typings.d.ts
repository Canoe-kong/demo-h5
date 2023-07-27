import '@umijs/max/typings';
declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';
declare const REACT_APP_ENV: 'dev' | 'test' | 'uat' | 'prod';
declare module 'less-vars-to-js';
declare const PROD_API: string;
declare interface PostMessageCallbackRes {
  action: string;
  params: {
    result: any;
  };
}
// declare global {
interface Window {
  setCustomUA: (cb: (data: string) => void) => void;
  scanCallBackCode: (res: PostMessageCallbackRes) => void;
  goBackCallBackCode: (res: PostMessageCallbackRes) => void;

  js2native: {
    postMessage: any;
  };
  webkit: any;
  refreshTokenCallback: (res: PostMessageCallbackRes) => void;
  qq: any;
}
declare const qq: any;
declare const TMap: any;
// }

interface Routes {
  /**
   * path 只支持两种占位符配置，
   * 第一种是动态参数 :id 的形式，
   * 第二种是 * 通配符，通配符只能出现路由字符串的最后。
   */
  path: string;
  /**
   * 配置 location 和 path 匹配后用于渲染的 React 组件路径。
   * 可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始寻找。
   * 如果指向 src 目录的文件，可以用 @，
   * 比如 component: '@/layouts/basic'，推荐使用 @ 组织路由文件位置。
   */
  component?: string;
  /**
   * 配置子路由，通常在需要为多个路径增加 layout 组件时使用
   */
  routes?: Routes[];
  /**
   * 配置路由的标题
   */
  title?: string;
  /**
   * 重定向
   * 配置路由跳转。
   */
  redirect?: string; //
  /**
   * 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。
   * 比如，可以用于路由级别的权限校验
   */
  wrapper?: string[];
  // 以下为新增
  /**
   * 是否缓存当前界面，跳转到下一个路由不会卸载当前路由组件
   */
  keepAlive?: boolean;
}
