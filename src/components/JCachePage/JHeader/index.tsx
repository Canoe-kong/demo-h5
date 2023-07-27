import { useMemo } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { NavBar, NavBarProps } from 'antd-mobile';
import { history } from '@umijs/max';

type JHeaderType = React.FC<NavBarProps> & {
  ownKey: symbol;
  back: null | (() => void);
  height: number; //高度
};

const JHeader: JHeaderType = (props) => {
  const { children, right, className, ...attr } = props;

  // 每一个header在进来钱都可以通过JHeader.back进行修改返回的逻辑
  const _back = useMemo(() => {
    console.log('加载几次memo', JHeader.back);
    const _ = JHeader.back;
    if (JHeader.back) {
      // JHeader.back = null;
    }
    return _;
  }, []);
  const onBack = () => {
    // 可以外界控制
    if (_back) {
      console.log('使用上一个界面提供的的back');
      _back?.();
    } else if (JHeader.back) {
      console.log('使用JHeader的back');

      JHeader.back?.();
    } else {
      console.log('默认返回');
      history.back();
    }
  };
  return (
    <NavBar
      backArrow={<div className={styles.backArrow} />}
      right={right}
      className={classNames(styles.JHeader, className)}
      onBack={onBack}
      style={{ '--height': JHeader.height + 'px' }}
      {...attr}
    >
      {children || document.title}
    </NavBar>
  );
};
JHeader.height = 44;
JHeader.back = null;
JHeader.ownKey = Symbol.for('JHeader'); // 唯一标识

export default JHeader;
