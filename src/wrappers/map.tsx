import { Outlet } from 'umi';
import { FC, useEffect, useState } from 'react';
import { loadJS } from '@/utils';
const mapUrl = process.env.T_MAP_URL || '';
const Map: FC = () => {
  const [initMap, setInitMap] = useState(false);
  useEffect(() => {
    loadJS(mapUrl, () => {
      // window.TMap = qq.maps;
      setInitMap(true);
    });
  }, []);
  return initMap ? <Outlet /> : <></>;
};
export default Map;
