/**
 * 与app交互action
 */

import { history } from '@umijs/max';
import { getValueFromUA } from './ua';

/**
 * 调用方法：
 * const NativeParams = JSON.stringify({
      action: ACTION_CODE,
      callback: FUNCTION,
    });
 *  window?.js2native?.postMessage?.(NativeParams)
 */
/**
 * app返回数据格式
 * {
 * action:与postmessage的action一样
 * params:{
 *    result:any
 *  }
 * }
 */

/**
 * 通知app打开扫码
 * 参数
 * callback:回调方法，app操作成功后调用挂在window上的回调方法
 */
export const ACTION_SCAN = 'scan';
/**
 * 通知app下载文件
 * 参数 url:文件下载地址
 * callback:回调方法，app操作成功后调用挂在window上的回调方法
 */
export const ACTION_DOWN_LOAD = 'download';
/**
 * 通知app微信分享文件/图片
 * 参数  params: {"type": "file","url":"https://xxxx.com/1234.pdf", "title": "我是一个文件名称", "suffix": ".pdf"}}
 * callback:回调方法，app操作成功后调用挂在window上的回调方法
 */
export const ACTION_SHARE_FILE_TO_WX = 'wechatShare';

/**
 * 通知app 更新token并返回
 * 参数
 * callback:回调方法，app操作成功后调用挂在window上的回调方法
 */
export const ACTION_REFRESH_TOKEN = 'accessTokenInvalid';

/**
 * 原生app返回操作
 */
export const ACTION_POP = 'popStack';

/**
 * 定义h5返回操作
 */
export const ACTION_GOBACK = 'goBack';

/**
 * 更新title
 */
export const ACTION_UPDATETITLE = 'updateTitle';

/**
 * 控制app的顶部
 */
export const ACTION_DISABLEDNAVBAR = 'disabledNavBar';
/**
 * 统一处理跟app的通信
 * @param action
 * @param params
 */
export const postMessageToApp = (
  action: string,
  params?: Record<string, any>,
) => {
  const NativeParams = JSON.stringify({
    action,
    ...params,
  });
  console.error('NativeParams', NativeParams);
  const buildNo = getValueFromUA('buildNo');
  if (Number(buildNo) > 402) {
    window?.flutter_inappwebview?.callHandler('js2native', NativeParams);
  } else {
    window?.js2native?.postMessage?.(NativeParams);
  }
};

/**
 * 初始化回退功能给合伙云app调用
 */
export const initGoBackAction = () => {
  window.goBackCallBackCode = (res: any) => {
    if (res?.action === ACTION_GOBACK) {
      history.back();
    }
  };
  postMessageToApp(ACTION_GOBACK, { callback: 'goBackCallBackCode' });
};

/**
 * 初始化界面的时候控制app的导航栏隐藏
 */
export const initNavBarAction = () => {
  postMessageToApp(ACTION_DISABLEDNAVBAR, { params: { disabled: false } });
};
