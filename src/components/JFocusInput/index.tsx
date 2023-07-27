import {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Input, InputProps, InputRef } from 'antd-mobile';

interface Props extends InputProps {
  dir?: 'rtl' | 'ltr';
}

const JFocusInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  props,
  ref,
) => {
  const { onBlur: _onBlur, style, ...attr } = props;
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<InputRef>(null);
  const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    _onBlur?.(e);
    setDisabled(true);
  };

  useImperativeHandle(ref, () => inputRef.current as InputRef);
  return (
    <div
      className={classNames('JFocusInput', styles.JFocusInput)}
      style={{
        pointerEvents: 'auto',
      }}
      onClick={() => {
        inputRef.current?.focus();
        setDisabled(false);
      }}
    >
      <Input
        ref={inputRef}
        style={Object.assign<CSSProperties, CSSProperties>(
          {
            pointerEvents: disabled ? 'none' : 'auto',
          },
          style || {},
        )}
        onBlur={onBlur}
        {...attr}
      />
    </div>
  );
};

export default forwardRef(JFocusInput);
