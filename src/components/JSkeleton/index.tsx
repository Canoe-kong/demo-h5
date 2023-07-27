import { Skeleton, SkeletonProps } from 'antd-mobile';
import styles from './index.less';
import classNames from 'classnames';
import { CSSProperties, FC } from 'react';
type Data = {
  type?: 'Title' | 'Paragraph';
  height: string;
  animated?: boolean;
};
interface Props {
  data: (
    | {
        type?: 'Title' | 'Paragraph';
        height: string;
        animated?: boolean;
      }
    | string
  )[];
  className?: string;
  style?: CSSProperties;
}
export default (props: Props) => {
  const { data = [], className, style } = props;
  return (
    <div
      style={style || {}}
      className={classNames(styles.JSkeleton, className)}
    >
      {data?.map((c, i) => {
        const {
          animated = true,
          height = '60px',
          type,
        }: Data = typeof c === 'string' ? { height: c } : c;
        let View: FC<SkeletonProps> = Skeleton;
        if (type) {
          View = Skeleton[type];
        }
        return (
          <View
            key={i}
            animated={animated}
            style={{ height: height }}
            className={styles.customSkeleton}
          />
        );
      })}
    </div>
  );
};
