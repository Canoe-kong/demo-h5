import {
  Cascader,
  CascaderOption,
  Form,
  FormItemProps,
  Toast,
} from 'antd-mobile';
import { CascaderValue } from 'antd-mobile/es/components/cascader-view';
import { Rule } from 'antd/lib/form';
import { useCallback, useState } from 'react';
import styles from './index.less';
interface Props extends Omit<FormItemProps, 'children'> {
  options: CascaderOption[];
  name?: string;
  rules?: Rule[];
  required?: boolean;
  children?: (value: CascaderOption[]) => React.ReactNode;
  optionsLabel?: string[]; //每一列的label
}
const JCascaderInputItem: React.FC<Props> = (props) => {
  const {
    name = 'baseAddress',
    label = '省市区',
    options,
    rules = [],
    required = true,
    children,
    optionsLabel,
    ...formItemProps
  } = props;
  const [visible, setVisible] = useState(false);
  // 获取完整的option
  const getSelectOption = useCallback(
    (value: CascaderValue[] | undefined) => {
      const selectOption: CascaderOption[] = [];
      // 当children没了就是合法的
      const isVaild = !!value?.reduce?.((a: any, b: string) => {
        if (!a) {
          return false;
        }
        const { children, ...data } =
          a?.find((c: { value: string }) => c.value === b) ?? {};
        selectOption.push(data);
        return children ?? false;
      }, options);

      return isVaild ? [] : selectOption;
    },
    [options],
  );
  // 切换省市区时手动滚动内容
const onTabsChange=(e:number)=>{
  // adm-list-item 所有list
  // adm-cascader-view-item-active 选中内容
  const activeDom = document.querySelectorAll('.adm-cascader-view-item-active')
  if(activeDom[e]){
  setTimeout(()=>{
    activeDom[e].scrollIntoView(true)
  },100)
  }else {
    const tabContentDom = document.querySelectorAll('.adm-tabs-content')[e]
    const firstItemDom = tabContentDom.querySelectorAll('.adm-list-item')[0]
    setTimeout(()=>{
      firstItemDom.scrollIntoView(true)
    },100)
  }
}
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, curValues) =>
        prevValues[name] !== curValues[name] &&
        getSelectOption(curValues[name]).length > 0
      }
    >
      {({ getFieldValue, setFieldsValue }) => {
        // 获取列表的值
        const fieldValue: CascaderValue[] | undefined = getFieldValue(name);
        const selectOption = getSelectOption(fieldValue);

        return (
          <Form.Item
            label={label}
            name={name}
            trigger="null"
            onClick={() => {
              setVisible(true);
            }}
            rules={[{ required, message: '请选择' + label }, ...rules]}
            childElementPosition="right"
            className={styles.AddressItem}
            {...formItemProps}
          >
            <Cascader
              visible={visible}
              value={fieldValue}
              onCancel={() => {
                setVisible(false);
              }}
              onTabsChange={
                onTabsChange
              }
              onConfirm={(value: CascaderValue[]) => {
                if (getSelectOption(value).length) {
                  setFieldsValue({ [name]: value });
                  setVisible(false);
                } else {
                  // setValue(fieldValue);
                  const activeLabel =
                    optionsLabel?.[value?.length as number] || false;
                  Toast.show({
                    content: activeLabel
                      ? '请选择' + activeLabel
                      : '请完整选择' + label,
                  });
                }
              }}
              options={options}
              placeholder={'请选择'}
            >
              {() => {
                if (children) {
                  return children?.(selectOption);
                }

                const d = selectOption?.map((c) => c?.label);
                return (
                  <div
                    className={styles.text}
                    style={{ color: d?.length ? '#000' : '#ccc' }}
                  >
                    {d && d?.length ? d?.join('-') : '请选择' + label}
                  </div>
                );
              }}
            </Cascader>
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default JCascaderInputItem;
