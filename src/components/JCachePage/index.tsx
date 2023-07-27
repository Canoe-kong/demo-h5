import { useEffect, useReducer } from 'react';
import styles from './index.less';
import JMyHelmet from '../JMyHelmet';
import { KeepAlive, AliveScope } from 'react-activation';
import JFullPage from './JFullPage';
import { useAppData, Outlet, history } from '@umijs/max';
import { Context, reducer, initState, actions } from './model';
import useRefreshCache from './hooks/useRefreshCache';
interface Props {
  // routes: Routes;
}

const JCachePage: React.FC<Props> = () => {
  const { routes } = useAppData();

  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    dispatch({ type: actions.CHANGE, payload: { routes } });
  }, [routes]);

  // 更新stack
  const [lastStack] = useRefreshCache((routeStack, currentRoute) => {
    // 不匹配，到404，一般不会有问题
    if (!currentRoute) {
      history.push('/404');
      return;
    }
    dispatch({
      type: actions.CHANGE,
      payload: {
        routeStack,
        currentRoute,
      },
    });
  }, state.routeStack);

  const title = lastStack?.route?.title || '立充';
  const keepAlive = !!lastStack?.route?.keepAlive;
  const pathname = lastStack?.pathname;
  useEffect(() => {
    console.log('全局的context=====', state, keepAlive);
  }, [state]);
  return (
    <>
      {!!title && <JMyHelmet title={title}></JMyHelmet>}
      <KeepAlive id={pathname} name={pathname} when={keepAlive}>
        <Context.Provider value={{ state, dispatch }}>
          <JFullPage title={title}>
            <div className={styles.JCachePage}>
              <Outlet />
            </div>
          </JFullPage>
        </Context.Provider>
      </KeepAlive>
    </>
  );
};

export default JCachePage;
export { default as useRefreshCacheFn } from './hooks/useRefreshCacheFn';
export { default as useHistory } from './hooks/useHistory';
export { default as useRouteProps } from './hooks/useRouteProps';
export { default as useRouteEffect } from './hooks/useRouteEffect';
