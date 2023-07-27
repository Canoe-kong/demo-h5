import { useContext } from 'react';
import { Context } from '../model';
import { useAliveController } from 'react-activation';
import { useMemoizedFn } from 'ahooks';

/**
 * 刷新缓存栈,提供给界面组件使用
 * @returns (delta:number)=>void delta默认0，刷新当前调用该方法的界面，1~标识之前的栈
 */
const useRefreshCacheFn = () => {
  const {
    state: { routeStack },
  } = useContext(Context);
  const { dropScope } = useAliveController();
  const refreshCache = useMemoizedFn((delta: number = 0) => {
    routeStack
      .slice(-1 - delta)
      .forEach((c) => c?.route?.keepAlive && dropScope(c?.pathname));
  });
  return refreshCache;
};

export default useRefreshCacheFn;
