import { memo, CSSProperties } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { ErrorBlock, ErrorBlockProps } from 'antd-mobile';

interface Props extends ErrorBlockProps {
  className?: string;
  style?: CSSProperties;
}

const Index: React.FC<Props> = (props) => {
  const { className, ...attr } = props;
  return (
    <ErrorBlock
      status={'empty'}
      className={classNames(styles.JErrorBlock, className)}
      {...attr}
    ></ErrorBlock>
  );
};

export default memo(Index);
