import { history } from '@umijs/max';
import { To, parsePath } from 'history';
import { useContext, useMemo } from 'react';
import { Context, actions } from '../model';
import { HistoryState } from '../typings';

// 改造下push和replace
// 为了实现跳转时能够通过state传方法，实现每个路由有自己的props
const useHistory = () => {
  const { dispatch } = useContext(Context);
  const _history = useMemo(() => {
    const getProps = (to: To, state?: HistoryState) => {
      let other: any = state;
      let props = null;
      if (state && typeof state === 'object' && state?.props) {
        const { props: _, ...others } = state;
        other = others;
        props = _;
      }
      const { pathname } = typeof to === 'string' ? parsePath(to) : to;
      console.log('useHistory===============', dispatch, pathname, props);
      if (pathname && props) {
        dispatch?.({
          type: actions.ROUTE_PROPS,
          payload: {
            routeProps: { pathname: props },
          },
        });
      }
      return other;
    };
    // 修改history

    const push = (to: To, state?: HistoryState) => {
      const other = getProps(to, state);
      // 提取出方法
      history.push(to, other);
    };
    const replace = (to: To, state?: HistoryState) => {
      const other = getProps(to, state);
      // 提取出方法
      history.replace(to, other);
    };
    return { ...history, push, replace };
  }, []);
  return _history;
};

export default useHistory;
