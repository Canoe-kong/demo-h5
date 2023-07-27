import {
  Form,
  FormItemProps,
  Picker,
  PickerProps,
  PickerRef,
} from 'antd-mobile';
import {
  PickerColumn,
  PickerValue,
} from 'antd-mobile/es/components/picker-view';
import { RefObject } from 'react';
import styles from './index.less';
import classNames from 'classnames';
interface Props extends FormItemProps {
  name: string;
  label: string;
  placeholder?: string;
  pickerProps?: Omit<PickerProps, 'columns'>;
  columns: PickerColumn[] | ((value: PickerValue[]) => PickerColumn[]);
}
const Index: React.FC<Props> = (props) => {
  const {
    name,
    label,
    placeholder,
    columns,
    pickerProps = {},
    ...formProps
  } = props;
  return (
    <Form.Item
      name={name}
      label={label}
      childElementPosition="right"
      trigger="onConfirm"
      onClick={(e, datePickerRef: RefObject<PickerRef>) => {
        datePickerRef.current?.open();
      }}
      {...formProps}
    >
      <Picker columns={columns} {...pickerProps}>
        {pickerProps?.children ??
          ((value) => {
            const d = value[0]?.label;
            return (
              <div
                className={classNames(styles.text, 'PickerFormItemText')}
                style={{ color: d ? '#000' : '#ccc' }}
              >
                {d ?? placeholder}
              </div>
            );
          })}
      </Picker>
    </Form.Item>
  );
};

export default Index;
