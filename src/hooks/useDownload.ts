import { useCallback, useEffect, useState } from 'react';
import { ACTION_DOWN_LOAD, postMessageToApp } from '../utils/hybrid';
/**
 * 下载文件
 * @returns [downloadCallBackCode:function 调用下载文件后回调,res:object 文件下载结果]
 */
type DownloadParams ={
    url:string,
    fileName?:string,
    extension?:string,
    type?:'image'|'file'
}
const useDownload = () => {
  const [res, setRes] = useState('');
  // 注册回调方法       
  useEffect(() => {
    // 扫码回调
    const downloadCallBackCode = (res: any) => {
      console.log('调用下载文件后回调 返回内容', res);
      if (res?.action === ACTION_DOWN_LOAD) {
        const result = res?.params?.result;
         setRes(result);
      }
    };
    window['downloadCallBackCode'] = downloadCallBackCode;
  }, []);
  const openDownload = useCallback((res:DownloadParams) => {
    postMessageToApp(ACTION_DOWN_LOAD, { callback: 'downloadCallBackCode' ,params:{...res}});
  }, []);
  return {openDownload, callBackInfo:res};
};

export default useDownload;
