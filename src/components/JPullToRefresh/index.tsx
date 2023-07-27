import { memo, CSSProperties } from 'react';

import { DotLoading, PullToRefresh, PullToRefreshProps } from 'antd-mobile';

interface Props extends PullToRefreshProps {
  className?: string;
  style?: CSSProperties;
}

const Index: React.FC<Props> = (props) => {
  const { children, ...attr } = props;
  return (
    <PullToRefresh
      renderText={() => {
        return (
          <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}>
            <DotLoading color="currentColor" />
            <span>正在刷新</span>
          </div>
        );
      }}
      {...attr}
    >
      {children}
    </PullToRefresh>
  );
};

export default memo(Index);
