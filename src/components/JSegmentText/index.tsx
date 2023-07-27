import { memo, CSSProperties, ReactNode } from 'react';
import styles from './index.less';
import classNames from 'classnames';

interface Props {
  className?: string;
  textClassName?: string;
  style?: CSSProperties;
  text: ReactNode[];
  wrap?: boolean;
}

const JSegmentText: React.FC<Props> = (props) => {
  const { className, text, textClassName, wrap } = props;
  return (
    <div className={classNames(styles.JSegmentText, className)}>
      {text?.map((c, i) => {
        return (
          <div
            style={wrap ? { display: 'inline' } : {}}
            key={i}
            className={classNames(styles.textNoWrap, textClassName)}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

export default memo(JSegmentText);
