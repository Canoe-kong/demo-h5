import { useCallback, useEffect, useState } from 'react';
import {  ACTION_SHARE_FILE_TO_WX, postMessageToApp } from '../utils/hybrid';
/**
 * 下载文件/分享图片
 * @returns [wechatShareCallBackCode:function 调用下载文件后回调,res:object 文件下载结果]
 */
type DownloadParams ={
    url:string,
    fileName?:string,
    extension?:string,
    base64String?:string,
    type?:'image'|'file'
}
const useShareFileToWX = () => {
  const [res, setRes] = useState('');
  // 注册回调方法       
  useEffect(() => {
    // 扫码回调
    const wechatShareCallBackCode = (res: any) => {
      console.log('调用下载文件后回调 返回内容', res);
      if (res?.action === ACTION_SHARE_FILE_TO_WX) {
        let result = res?.params?.result;
           setRes(result);
      }
    };
    window['wechatShareCallBackCode'] = wechatShareCallBackCode;
  }, []);
  const openShareWX = useCallback((res:DownloadParams) => {
    postMessageToApp(ACTION_SHARE_FILE_TO_WX, { callback: 'wechatShareCallBackCode' ,params:{...res}});
  }, []);
  return {openShareWX, callBackInfo:res};
};

export default useShareFileToWX;
