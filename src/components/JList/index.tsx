import useList, { DataType } from '@/hooks/useList';
import { DotLoading, ErrorBlockProps, InfiniteScroll, List } from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.less';
import { JErrorBlock, JPullToRefresh } from '@/components';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { CSSProperties } from 'react';

export interface JListProps<D = any> {
  url: string;
  params?: {
    search?: string;
    [key: string]: any;
  };
  className?: string;
  listHeaderComponent?: React.ReactNode | ((data: any) => React.ReactNode);
  renderItem: (data: D, index: number) => React.ReactNode;
  keyExtractor?: (data: D, index: number) => string;
  mock?: boolean;
  method?: 'GET' | 'POST';
  disabledRefresh?: boolean;
  style?: CSSProperties;
  routeEffect?: boolean;
  getRef?: (ref: JListRef) => void;
  immediate?: boolean; // 是否立即进行数据请求
  errorBlockProps?: ErrorBlockProps;
}

export interface JListRef<D = any> {
  setData: React.Dispatch<React.SetStateAction<D[]>>;
  data: D;
  nextPage: () => Promise<boolean | DataType<D>>;
  refresh: () => Promise<boolean | DataType<D>>;
  hasMore: boolean;
}
const Index: React.ForwardRefRenderFunction<JListRef, JListProps> = (
  props,
  ref,
) => {
  const {
    url,
    params = {},
    className,
    listHeaderComponent,
    renderItem,
    keyExtractor,
    mock = false,
    method = 'GET',
    routeEffect = true,
    disabledRefresh = false,
    style = {},
    getRef,
    immediate = true,
    errorBlockProps = {},
  } = props;
  const { data, isInit, hasMore, otherData, nextPage, refresh, setData } =
    useList<any>(url, {
      params,
      mock,
      method,
      routeEffect,
      immediate,
    });
  const refreshRef = useRef(false);
  // useImperativeHandle 失效
  useEffect(() => {
    getRef?.({ setData, hasMore, refresh, nextPage, data });
  }, [data]);
  useImperativeHandle(ref, () => {
    return {
      setData,
      hasMore,
      refresh,
      nextPage,
      data,
    };
  });
  console.log(
    'JList初始=======hasMore:',
    hasMore,
    'refreshRef:',
    refreshRef.current,
    hasMore && !refreshRef.current,
  );
  return (
    <div className={classNames(styles.JList, className)}>
      {typeof listHeaderComponent === 'function'
        ? listHeaderComponent?.(otherData)
        : listHeaderComponent || null}
      <div className={styles.scrollContent} style={style}>
        <JPullToRefresh
          disabled={disabledRefresh}
          onRefresh={async () => {
            console.log('onRefresh=====');
            refreshRef.current = true;
            await refresh();
            refreshRef.current = false;
          }}
          renderText={() => {
            return (
              <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}>
                <DotLoading color="currentColor" />
                <span>正在刷新</span>
              </div>
            );
          }}
        >
          {(data && data?.length > 0) || hasMore ? (
            <>
              <List mode="card" className={styles.list}>
                {data?.map((c, i) => {
                  const key = keyExtractor?.(c, i) || i;
                  return (
                    <List.Item className={styles.listItem} key={key}>
                      {renderItem?.(c, i)}
                    </List.Item>
                  );
                })}
              </List>
              <InfiniteScroll
                loadMore={async () => {
                  console.log('loadMore=====');
                  await nextPage();
                }}
                hasMore={!isInit && hasMore && !refreshRef.current}
              ></InfiniteScroll>
            </>
          ) : (
            <JErrorBlock fullPage={true} {...errorBlockProps} />
          )}
        </JPullToRefresh>
      </div>
    </div>
  );
};
export default forwardRef(Index);
