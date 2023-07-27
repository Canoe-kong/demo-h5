import { useLocation, useSelectedRoutes, history } from '@umijs/max';
import { useMemo } from 'react';
import { RouteProps } from '../typings';
/**
 * 补充max没有实现的useRoutesProps
 * 读取当前路由在路由配置里的 props 属性，你可以用此 hook 来获取路由配置中的额外信息
 * @returns RouteProps
 */
const useRouteProps = (): RouteProps => {
  const { pathname } = useLocation();
  const selectRoutes = useSelectedRoutes();

  const currentRoute = useMemo(() => {
    return {
      ...(selectRoutes?.find((c) => {
        return c?.pathname === pathname;
      }) ||
        selectRoutes.at(-1) ||
        {}),
      location: {
        action: history.action,
        ...history.location,
      },
    };
  }, [pathname]);
  return currentRoute as RouteProps;
};
export default useRouteProps;
