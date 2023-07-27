import { CSSProperties, ReactNode } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import React from 'react';
import JHeader from '../JHeader';
import useRouteProps from '../hooks/useRouteProps';

interface Props {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  right?: ReactNode;
  title?: string;
  disabledHeader?: boolean;
}
type JFullPageType = React.FC<Props> & {
  HeaderSlot: typeof JHeader;
};

const JFullPage: JFullPageType = (props) => {
  const { children, className, disabledHeader = false, title, style } = props;
  const {
    route: { customHeader },
  } = useRouteProps();
  // 提取Header节点,但是当放在最上层，子元素有Outlet，导致没法解析
  let headerNode = <JHeader>{title || document.title}</JHeader>;
  return (
    <div className={classNames(styles.JFullPage, className)} style={style}>
      {!disabledHeader && (
        <div className={styles.headContent}>{!customHeader && headerNode}</div>
      )}
      <div className={styles.mainContent}>{children}</div>
    </div>
  );
};
JFullPage.HeaderSlot = JHeader;

export default JFullPage;
