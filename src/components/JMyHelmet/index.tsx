/*
 * @Author: xumingyue
 * @Date: 2022-05-23 10:52:37
 * @Description: 动态改变页面title
 */
import React from 'react';
import { Helmet } from 'umi';
type PropsType = {
  title: string;
  [keyName: string]: any;
};
const MyHelmet: React.FC<PropsType> = (props) => {
  return (
    <Helmet>
      <title>{props.title}</title>
    </Helmet>
  );
};
export default MyHelmet;
