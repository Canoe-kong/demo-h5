import {
  memo,
  CSSProperties,
  useState,
  useEffect,
  FocusEventHandler,
  useRef,
} from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Input, InputProps } from 'antd-mobile';

interface Props extends InputProps {
  className?: string;
  style?: CSSProperties;
  onChange?: (v: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  value?: string;
  changeValue?: string; //当使用form的时候，这个可以有限急搞过value去显示和修改值
  max?: number;
  min?: number;
  decimals?: number; //允许多少位小数，不定义即不需要控制
}
// const reg = /^-?[1-9]\d*$/;
const Index: React.FC<Props> = (props) => {
  const {
    className,
    value,
    onChange,
    onBlur,
    max,
    min,
    decimals,
    style,
    changeValue,
    ...attr
  } = props;
  const [data, setData] = useState(value ?? '');
  const keyRef = useRef(false); //记录是否是按钮触发的修改
  const backRef = useRef(false); //是否是删除
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    changeValue ?? setData(changeValue || '');
  }, [changeValue]);
  useEffect(() => {
    setData(value ?? '');
  }, [value]);
  useEffect(() => {
    onChange?.(data);
  }, [data]);

  const _onblur: FocusEventHandler<HTMLInputElement> = (e) => {
    let v = e.target.value;
    setData(`${v}`);
    e.target.value = `${v}`;
    onBlur?.(e);
  };
  const _onChange = (v: string) => {
    if (
      (v?.length >= 2 && v?.[0] === '0' && v?.[1] !== '.') ||
      v.split('.').length >= 3 ||
      v === '.' ||
      (decimals !== undefined && v?.split('.')[1]?.length > decimals)
    ) {
      return;
    }
    // 处理当输入的数据不合法时，input帮我们进行清空，但不是输入框没有清空的情况
    if (v === '') {
      if (keyRef.current && !backRef.current) {
        //输入了
        console.log('input自动清空');
        backRef.current = false;
        keyRef.current = false;
        return;
      }
    }

    setData(v || '');
    backRef.current = false;
    keyRef.current = false;
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    keyRef.current = true;
    backRef.current = e.key === 'Backspace'; //是否是删除
  };

  return (
    <div className={classNames(styles.JMoneyInput, className)} style={style}>
      <Input
        value={data}
        onChange={_onChange}
        // type={'number'}
        // max={max}
        // min={min}
        onBlur={_onblur}
        inputMode="decimal"
        onKeyDown={onKeyDown}
        {...attr}
      />
    </div>
  );
};

export default memo(Index);
