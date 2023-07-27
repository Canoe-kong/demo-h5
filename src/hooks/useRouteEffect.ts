import { EffectCallback, useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useStore } from '@umijs/max';
import { DvaType } from '@/models';
import { useActivate, useUnactivate } from 'react-activation';

type Return = ReturnType<EffectCallback>;
/**
 * 配合react-activation，当再次进入这个界面调用回调
 * @param cb Function
 */
const useRouteEffect = (
  cb: (data: {
    type: 'effect' | 'history';
    isInit: boolean;
    state: DvaType;
  }) => Return,
  deps?: React.DependencyList | undefined,
) => {
  // 获取最新的store
  const { getState } = useStore();
  const memoizedCb = useMemoizedFn(cb);
  const returnRef = useRef<Return | null>(null);
  const initRef = useRef(true);

  useEffect(() => {
    // 存在依赖才能用这个副作用
    if (deps) {
      console.log('deps', deps);
      returnRef.current = memoizedCb?.({
        type: 'effect',
        isInit: initRef.current,
        state: getState(),
      });
      if (initRef.current) initRef.current = false;
    }
    return () => {
      returnRef.current?.();
    };
  }, deps);
  useActivate(() => {
    console.log('活跃');
    //如果是当前路由，调回调
    returnRef.current = memoizedCb?.({
      type: 'history',
      isInit: initRef.current,
      state: getState(),
    });
    if (initRef.current) initRef.current = false;
  });
  useUnactivate(() => {
    console.log('不活跃');
    returnRef.current?.();
  });
};
export default useRouteEffect;
