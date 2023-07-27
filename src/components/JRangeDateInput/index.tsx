import {
  memo,
  CSSProperties,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import styles from './index.less';
import classNames from 'classnames';
import {
  ButtonProps,
  DatePicker,
  DatePickerProps,
  InputProps,
  Toast,
} from 'antd-mobile';
import dayjs from 'dayjs';
import { useUpdateEffect } from 'ahooks';
export type Time = Date | '';
export type JRangeDateChangeType = {
  start: Time;
  end: Time;
  type: 'start' | 'end';
};
interface Props extends ButtonProps {
  className?: string;
  style?: CSSProperties;
  datePickerProps?: DatePickerProps;
  inputProps?: InputProps;
  startInputPorps?: InputProps;
  endInputPorps?: InputProps;
  onChange?: ({ start, end }: JRangeDateChangeType) => void;
  start?: Time;
  end?: Time;
  onDatePickerConfirm?: (val: {
    preTime: Time;
    nextTime: Time;
    type: 'start' | 'end';
  }) => Time;
}
export interface JRangeDateInputRef {
  resetDate: () => void;
  resetPreValue?: () => void; //复位上一次确认的值
  onConfirmDate: () => void; //需要走主动调用才能知道值卡你的值
}
const Index: React.ForwardRefRenderFunction<JRangeDateInputRef, Props> = (
  props,
  ref,
) => {
  const {
    className,
    datePickerProps = {},
    // inputProps = {},
    // startInputPorps = {},
    // endInputPorps = {},
    onChange,
    start = '',
    end = '',
    onDatePickerConfirm,
  } = props;
  const [startTime, setStartTime] = useState<Time>(start);
  const [endTime, setEndTime] = useState<Time>(end);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endtPickerVisible, setEndPickerVisible] = useState(false);
  const preValueRef = useRef({ startTime, endTime }); //存之前的值

  useUpdateEffect(() => {
    onChange?.({ end: endTime, start: startTime, type: 'start' });
  }, [startTime]);
  useUpdateEffect(() => {
    onChange?.({ end: endTime, start: startTime, type: 'end' });
  }, [endTime]);
  useImperativeHandle(
    ref,
    () => ({
      resetDate() {
        setEndTime('');
        setStartTime('');
      },
      onConfirmDate: () => {
        preValueRef.current = { startTime, endTime };
      },
      resetPreValue: () => {
        setEndTime(preValueRef.current.endTime);
        setStartTime(preValueRef.current.startTime);
      },
    }),
    [startTime, endTime],
  );
  return (
    <div className={classNames(styles.JRangeDateInput, className)}>
      <div
        className={styles.input}
        style={{ color: startTime ? '#000' : 'rgba(0,0,0,0.4' }}
        onClick={() => setStartPickerVisible(true)}
      >
        {startTime ? dayjs(startTime).format('YYYY-MM-DD') : '开始时间'}
      </div>
      <div className={styles.divide} />
      <div
        className={styles.input}
        style={{ color: endTime ? '#000' : 'rgba(0,0,0,0.4' }}
        onClick={() => setEndPickerVisible(true)}
      >
        {endTime ? dayjs(endTime).format('YYYY-MM-DD') : '结束时间'}
      </div>

      <DatePicker
        title="时间选择"
        value={startTime || new Date()}
        visible={startPickerVisible}
        onClose={() => {
          setStartPickerVisible(false);
        }}
        min={new Date('2023-01-01')}
        max={new Date()}
        onConfirm={(val) => {
          if (onDatePickerConfirm) {
            setStartTime((pre) =>
              onDatePickerConfirm({
                preTime: pre,
                nextTime: val,
                type: 'start',
              }),
            );
          } else {
            if (endTime && endTime < val) {
              Toast.show({ content: '开始时间不允许大于结束时间' });
              return;
            }
            setStartTime(val);
          }
        }}
        destroyOnClose={true}
        {...datePickerProps}
      />
      <DatePicker
        title="时间选择"
        value={endTime || new Date()}
        visible={endtPickerVisible}
        onClose={() => {
          setEndPickerVisible(false);
        }}
        destroyOnClose={true}
        min={new Date('2023-01-01')}
        max={new Date()}
        onConfirm={(val) => {
          if (onDatePickerConfirm) {
            setEndTime((pre) =>
              onDatePickerConfirm({ preTime: pre, nextTime: val, type: 'end' }),
            );
          } else {
            if (startTime && startTime > val) {
              Toast.show({ content: '结束时间不允许小于开始时间' });
              return;
            }
            setEndTime(val);
          }
        }}
        {...datePickerProps}
      />
    </div>
  );
};

export default memo(forwardRef(Index));
