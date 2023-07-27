import { Outlet } from 'umi';
import { FC } from 'react';
import { JFullPage } from '@/components';
const Full: FC = () => {
  return (
    <JFullPage>
      <Outlet />
    </JFullPage>
  );
};
export default Full;
