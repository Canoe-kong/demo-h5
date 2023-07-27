import { useCallback, useEffect, useState } from 'react';
import { ACTION_SCAN, postMessageToApp } from '../utils/hybrid';
/**
 * 打开摄像头扫码
 * @returns [openScan:function 打开扫码方法,res:object 扫码结果]
 */

const useScan = (cb?: (v: string) => void): [() => void, string] => {
  const [res, setRes] = useState('');

  // 注册回调方法
  useEffect(() => {
    // 扫码回调
    const scanCallBackCode = (res: any) => {
      console.log('扫码后的回调 返回内容', res);
      if (res?.action === ACTION_SCAN) {
        const result = res?.params?.result;
        cb?.(result); 
        setRes(result);
      }
    };
    window['scanCallBackCode'] = scanCallBackCode;
  }, []);
  const openScan = useCallback(() => {
    postMessageToApp(ACTION_SCAN, { callback: 'scanCallBackCode' });
  }, []);
  return [openScan, res];
};

export default useScan;
