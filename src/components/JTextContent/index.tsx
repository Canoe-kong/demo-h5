import { ReactNode, memo } from 'react';
import styles from './index.less';
import classNames from 'classnames';

export interface JTextContentDataType {
  title: string;
  value: ReactNode; // 当这个为null||undefined 不显示,为''显示为'-',需要空值设置为' '
  extra?: ReactNode;
}
interface Props {
  className?: string;
  data: JTextContentDataType[];
  leftWidth?: number;
  leftClassName?: string;
  rightClassName?: string;
  labelClassName?: string;
}

const Index: React.FC<Props> = (props) => {
  const {
    className,
    data,
    leftClassName,
    rightClassName,
    leftWidth,
    labelClassName,
  } = props;
  return (
    <div className={classNames(styles.JTextContent, className)}>
      {data?.map((c) => {
        if (c.value === null || c.value === undefined) {
          return null;
        }
        return (
          <div
            key={c.title}
            className={classNames(styles.label, labelClassName)}
          >
            <div
              style={leftWidth ? { width: leftWidth + 'px' } : {}}
              className={classNames(styles.left, leftClassName)}
            >
              {c.title}
            </div>
            <div className={classNames(styles.right, rightClassName)}>
              {c.value !== '' ? c.value : '-'}
              {c?.extra}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Index);
