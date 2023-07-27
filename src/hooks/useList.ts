/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PostOptions, get, post } from '@/utils/request';
import { useEffect, useRef, useState } from 'react';
import { useUpdateEffect, useToggle } from 'ahooks';

import { useRouteEffect } from '@/components/JCachePage';
import { Toast } from 'antd-mobile';
export interface DataType<D = any> {
  pageNo: number;
  pageSize: number;
  totalCount: number;
  list: D[];
}
export interface UseList {
  <D = any>(
    url: string,
    data: {
      params?: {
        initPageNo?: number;
        initPageSize?: number;
        [key: string]: any;
      };
      mock?: boolean;
      method?: 'GET' | 'POST';
      routeEffect?: boolean; //是否开启路由变化重新请求
      immediate?: boolean; //是否立即进行请求
    },
  ): {
    data: D[];
    hasMore: boolean;
    setPageNo: (count: number) => Promise<boolean | DataType>;
    setPageSize: (count: number) => void;
    pageSize: number;
    pageNo: number;
    nextPage: () => Promise<boolean | DataType>;
    clearData: () => void;
    otherData: Partial<DataType>;
    refresh: () => Promise<boolean | DataType>; //刷新
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    isInit: boolean; //是否是初次更新
  };
}
// 逻辑比较烂，主要得配合antm的组件
// promise的resolve，处理nextPage的异步
let _resolve: ((value: boolean | DataType) => void) | null = null;
const useList: UseList = (
  url,
  {
    params,
    mock = false,
    method = 'GET',
    routeEffect = true,
    immediate = true,
  },
) => {
  const { initPageNo = 0, initPageSize = 10, ...other } = params || {};
  const [pageNo, setPageNo] = useState(initPageNo);
  const [pageSize, setPageSize] = useState(initPageSize);
  const [data, setData] = useState<any[]>([]);
  const hasMoreRef = useRef(true);
  const initRef = useRef(true);
  const [otherData, setOtherData] = useState({});
  const [state, { toggle }] = useToggle(true); // 控制数据请求
  const lockRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const queueRef = useRef<Function[]>([]);
  const immediateRef = useRef(!!immediate);
  const getData = () => {
    // lockRef.current = true;
    // const _other: Record<string, string> = {};
    // Object.keys(other).forEach((k) => (_other[k] = `${other[k]}`));
    let request = get;
    let data: PostOptions = {
      param: {
        pageNo: `${pageNo || 1}`,
        pageSize: `${pageSize}`,
        ...other,
      },
      customBaseUrl: mock ? '' : undefined,
      errorHalder: true,
    };
    if (method === 'POST') {
      request = post;
      data.data = { ...data.param };
      delete data.param;
    }

    request(url, data)
      .then((res: DataType) => {
        if (res) {
          if (initRef.current) initRef.current = false;
          _resolve?.(res);
          _resolve = null;

          // 处理接口直接返回数组
          if (res instanceof Array) {
            setData((pre: any[]) => {
              // console.log(pre);
              return [...pre, ...res];
            });
            hasMoreRef.current = false;
          } else {
            const { list, ...other } = res;

            list &&
              setData((pre: any[]) => {
                // console.log(pre);
                return [...pre, ...list];
              });
            hasMoreRef.current = pageNo * pageSize < res?.totalCount;
            setOtherData(other);
          }

          if (queueRef.current.length) {
            queueRef.current.pop()?.();
          }
        }
      })
      .catch((err) => {
        Toast.show({
          icon: 'fail',
          content: err?.msg || '非常抱歉，系统开小差...',
        });
        _resolve?.(false);
        _resolve = null;
        hasMoreRef.current = false;
        while (queueRef.current.length) {
          queueRef.current.pop()?.(false);
        }
      })
      .finally(() => {
        lockRef.current = false;
      });
  };
  // 配合InfiniteScroll loadMore异步
  const changePageNo = (count: number) => {
    return new Promise<boolean | DataType>((resolve) => {
      if (!immediateRef.current) {
        immediateRef.current = true;
        resolve(false);
      } else if (!hasMoreRef.current) {
        resolve(false);
      } else {
        // 默认成功，进行数据请求，失败的话直接resolve false
        const cacheCb = (success: boolean = true) => {
          if (success) {
            if (hasMoreRef.current) {
              setPageNo(count);
              toggle();
              lockRef.current = true;
            }
            _resolve = resolve;
          } else {
            resolve(false);
          }
        };
        // 如果请求锁住，存起来
        if (lockRef.current) {
          queueRef.current.push(cacheCb);
        } else {
          cacheCb();
        }
      }
    });
  };
  // 改变页数量
  const changePageSize = (count: number) => {
    setPageSize(count);
  };
  // 请求同步化，配合antm的组件
  const nextPage = async () => {
    return await changePageNo(pageNo + 1);
  };
  // 清除数据
  const clearData = () => {
    hasMoreRef.current = true;
    setData([]);
    setPageNo(1);
  };
  // 刷新，重置页码
  const refresh = () => {
    hasMoreRef.current = true;

    return new Promise<boolean | DataType>((resolve) => {
      changePageNo(1).then((res) => {
        console.log('changePageNo返回的数据：', res);
        resolve(res);
      });

      // 再封一层,可以做到在数据更新前清空以前的数据
      if (_resolve) {
        const oldResolve = _resolve;
        _resolve = (value: boolean | DataType) => {
          setData([]);
          oldResolve?.(value);
        };
      }
    });
  };

  const update = () => {};
  // 其他参数是可以重置页码，第一次加载的时候不调用
  // 参数变化使用refresh
  useEffect(() => {
    console.log('useList主动refresh====', other);
    refresh();
  }, [JSON.stringify(other), url, pageSize]);
  // 路由过来这个界面时，重新请求，当state变化，进行数据请求，统一由state控制getData
  useRouteEffect(
    ({ isInit, type }) => {
      if (!isInit) {
        if (type === 'history' && routeEffect) {
          // 路由变化尝试更新，不清除原始数据
          refresh();
        } else if (type === 'effect') {
          getData();
        }
      }
    },
    [state, immediate],
  );
  // 页码改
  // useUpdateEffect(() => {
  // }, [pageNo, state]);

  return {
    data,
    pageNo,
    pageSize,
    hasMore: hasMoreRef.current,
    setPageNo: changePageNo,
    setPageSize: changePageSize,
    nextPage,
    clearData,
    otherData,
    refresh,
    isInit: initRef.current,
    // TODO:这期可以由外面控制数据
    setData,
  };
};

export default useList;
