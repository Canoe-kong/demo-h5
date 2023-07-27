/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-var */
import { ACTION_POP, postMessageToApp } from '@/utils/hybrid';
import dayjs from 'dayjs';
import { useEffect, useLayoutEffect } from 'react';
import { connect, history, withRouter } from 'umi';

import JCachePage from '@/components/JCachePage';

const Page = (state: any) => {
  useLayoutEffect(() => {
    // 针对合伙云app返回到最后一页不能单纯调用back，go的问题
    const _back = history.back;
    //处理返回逻辑，当在第一层时，调用app的返回
    history.back = () => {
      console.log('window.history.state.idx', window.history.state.idx);
      // 当路由栈空就调用app的返回
      if (window.history.state.idx === 0) {
        postMessageToApp(ACTION_POP);
      } else _back();
    };

    // go
    const _go = history.go;
    history.go = (delta: number) => {
      console.log('delta:', delta, -delta > window.history.state.idx);
      // 后退的步数大于栈里存在的数目，调用app的
      if (delta !== undefined && -delta > window.history.state.idx) {
        postMessageToApp(ACTION_POP);
      } else {
        _go(delta);
      }
    };
  }, []);
  const { dispatch } = state;

  useEffect(() => {
    // 获取基础地址
    dispatch({ type: 'baseData/queryEmployeeList' });
    dispatch({ type: 'baseData/queryShopTypeList' });
    dispatch({ type: 'baseData/queryAddressList' });
  }, []);

  return <JCachePage />;
};

export default connect((...data: any[]) => {
  console.group('dva数据');
  console.log(`%c 新值`, `color: #03A9F4; font-weight: bold`, data[0]);
  console.log(
    `%c 时间`,
    `color: #4CAF50; font-weight: bold`,
    dayjs().format('MM-DD HH:mm:ss'),
  );
  console.groupEnd();
  return { ...data };
})(withRouter(Page));
