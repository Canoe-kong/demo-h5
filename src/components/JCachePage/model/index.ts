import { createContext } from 'react';

import {
  CachePageType,
  ChangePayloadType,
  HistoryRouteProps,
} from '../typings';

export const actions = {
  CHANGE: 'CHANGE',
  ROUTE_PROPS: 'ROUTE_PROPS',
};
export const initState = {
  routes: {},
  currentRoute: null,
  routeStack: [],
  routeProps: {},
};
// 定义state[业务]处理逻辑 reducer函数
export function reducer(state: CachePageType, action: ChangePayloadType) {
  switch (action.type) {
    case actions.CHANGE:
      return {
        ...state,
        ...action?.payload,
      };
    case actions.ROUTE_PROPS:
      return {
        ...state,
        routeProps: {
          ...state.routeProps,
          ...action?.payload.routeProps,
        },
      };

    default:
      return state;
  }
}

export const Context = createContext<{
  state: CachePageType;
  dispatch?: React.Dispatch<React.ReducerAction<typeof reducer>>;
}>({ state: initState });
