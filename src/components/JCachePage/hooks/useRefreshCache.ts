import { useEffect, useMemo, useRef } from 'react';
import { useAliveController } from 'react-activation';
import { RouteProps } from '../typings';
import { useLatest, useMemoizedFn } from 'ahooks';
import useRouteProps from './useRouteProps';

/**
 * 路由更新时更新缓存
 * @param cb 路由更新回调
 * @param routeStack 路由栈，可不传，不传默认[]，传值更新时的基础值都是这个，会使用最新的
 * @returns [currentRoute: RouteProps | null]
 */
const useRefreshCache = (
  cb?: (routeStack: RouteProps[], currentRoute: RouteProps) => void,
  routeStack: RouteProps[] = [],
): [currentRoute: RouteProps | null] => {
  const currentRoute = useRouteProps();
  const routeStackRef = useLatest(routeStack);
  const cbMemoried = useMemoizedFn(cb || (() => {}));
  const { dropScope } = useAliveController();
  const initRef = useRef<boolean>(true); // 是否刚初始化,第一次因为action为pop，需要特殊处理
  // 立即执行
  useMemo(() => {
    if (!currentRoute?.location.action) {
      return;
    }
    const {
      location: { action, key },
      pathname,
    } = currentRoute;
    let refreshStack;
    if (action === 'PUSH' || initRef.current) {
      routeStackRef.current.push(currentRoute);
      initRef.current = false;
    } else if (action === 'REPLACE') {
      const stack = routeStackRef.current.pop();
      if (stack) refreshStack = [stack]; // 也要刷新
      routeStackRef.current.push(currentRoute);
    } else if (action === 'POP') {
      // 回退的话就判断回退到的栈后面又没有命中缓存栈
      let stateIndex = -1;
      routeStackRef.current.forEach((c, i) => {
        if (c?.location.key === key && c?.pathname === pathname) {
          stateIndex = i;
        }
      });
      refreshStack = routeStackRef.current.splice(stateIndex + 1);
      console.log('刷新缓存：', refreshStack);
    }
    if (refreshStack) {
      // 刷新缓存
      for (let i = 0; i < refreshStack?.length; i++) {
        if (refreshStack[i].route.keepAlive)
          dropScope(refreshStack[i].pathname);
      }
    }
    console.log('更新====路由', currentRoute, routeStackRef.current);

    cbMemoried?.(routeStackRef.current, currentRoute);
  }, [currentRoute]);
  useEffect(() => {
    return () => {
      console.log('卸载=======', routeStackRef);
      if (routeStackRef)
        for (let i = 0; i < routeStackRef.current?.length; i++) {
          if (routeStackRef.current[i].route.keepAlive)
            dropScope(routeStackRef.current[i].pathname);
        }
    };
  }, []);
  return [currentRoute];
};

export default useRefreshCache;
