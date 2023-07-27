import { Navigate, Outlet } from 'umi';
import { FC, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { JSkeleton } from '@/components';
const Auth: FC = () => {
  const isLogin = useAuth();
  if (isLogin === undefined) {
    // TODO:暂时去掉骨架，后续看更好的优化方案
    // return <></>;
    return <JSkeleton data={['15%', '15%', '15%', '15%', '15%', '15%']} />;
  }
  if (isLogin) {
    return <Outlet />;
  } else {
    return <Navigate to="/403" />;
  }
};
export default Auth;
