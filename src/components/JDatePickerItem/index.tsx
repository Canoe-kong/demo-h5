import {
  DatePicker,
  DatePickerProps,
  Form,
  FormItemProps,
  PickerRef,
} from 'antd-mobile';

import { ReactNode, RefObject } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import dayjs from 'dayjs';
interface Props extends FormItemProps {
  name: string;
  label: string;
  placeholder?: string;
  format?: string;
  pickerProps?: DatePickerProps;
  extra?: ReactNode;
}
const Index: React.FC<Props> = (props) => {
  const {
    name,
    label,
    placeholder,
    format = 'YYYY-MM-DD HH:mm',
    pickerProps = {},
    extra,
    ...formProps
  } = props;
  return (
    <Form.Item
      name={name}
      label={label}
      childElementPosition="right"
      trigger="onConfirm"
      arrow={<div className={styles.arrow}>{extra}</div>}
      onClick={(e, datePickerRef: RefObject<PickerRef>) => {
        datePickerRef.current?.open();
      }}
      {...formProps}
    >
      <DatePicker precision="minute" {...pickerProps}>
        {pickerProps?.children ??
          ((value) => {
            const d = value ? dayjs(value).format(format) : null;
            return (
              <div
                className={classNames(styles.text, 'PickerFormItemText')}
                style={{ color: d ? '#000' : '#ccc' }}
              >
                {d ?? placeholder}
              </div>
            );
          })}
      </DatePicker>
    </Form.Item>
  );
};

export default Index;
