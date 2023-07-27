import {
  memo,
  CSSProperties,
  useState,
  useEffect,
  FocusEventHandler,
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
  const [data, setData] = useState(value ?? undefined);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    changeValue ?? setData(changeValue || undefined);
  }, [changeValue]);
  useEffect(() => {
    setData(value ?? undefined);
  }, [value]);
  useEffect(() => {
if(data!==undefined){
  onChange?.(data);
}
  }, [data]);

  const _onblur: FocusEventHandler<HTMLInputElement> = (e) => {  
    let v = +e.target.value;
    if (max !== undefined && max < v) {
      v = max;
    } else if (min !== undefined && min > v) {
      v = min;
    }
    setData(`${v}`);
    e.target.value = `${v}`;

    onBlur?.(e);
  };
  const _onChange = (v: string) => {
    if (decimals !== undefined && v?.split('.')[1]?.length > decimals) {
      return;
    }

    setData(v);
  };

  return (
    <div className={classNames(styles.JNumberInput, className)} style={style}>
      <Input
        value={data}
        onChange={_onChange}
        type={'number'}
        // max={max}
        // min={min}
        onBlur={_onblur}
        inputMode="decimal"
        {...attr}
      />
    </div>
  );
};

export default memo(Index);
