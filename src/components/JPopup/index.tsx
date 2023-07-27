import {
  CSSProperties,
  ReactNode,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Popup, PopupProps } from 'antd-mobile';

export interface JPopupProps extends PopupProps {
  className?: string;
  style?: CSSProperties;
  reanderHeader?: (() => ReactNode) | null;
  title?: ReactNode;
  defaultVisible?: boolean;
  onConfirm?: (ref: JPopupRef) => void;
  onCancel?: (ref: JPopupRef) => void;
}
export interface JPopupRef {
  close: () => void;
  open: () => void;
}
const Index: React.ForwardRefRenderFunction<JPopupRef, JPopupProps> = (
  props,
  ref,
) => {
  const {
    children,
    className,
    reanderHeader,
    defaultVisible = false,
    title,
    onConfirm,
    onCancel,
    ...attr
  } = props;
  const [visible, setVisible] = useState(defaultVisible);
  const close = () => {
    setVisible(false);
  };
  const open = () => {
    setVisible(true);
  };
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <Popup
      className={classNames(styles.JPopup, className)}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}
      visible={visible}
      onMaskClick={close}
      {...attr}
    >
      {reanderHeader !== null
        ? reanderHeader?.() || (
            <div className={styles.header}>
              <div
                className={styles.cancel}
                onClick={() =>
                  (onCancel || close)?.({
                    open,
                    close,
                  })
                }
              >
                取消
              </div>
              <div className={styles.title}>{title}</div>
              <div
                className={styles.confirm}
                onClick={() => (onConfirm || close)?.({ open, close })}
              >
                确认
              </div>
            </div>
          )
        : null}
      {children}
    </Popup>
  );
};

export default forwardRef(Index);
