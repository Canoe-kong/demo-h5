import { useSelectedRoutes } from '@umijs/max';

const useRoute = () => {
  const location = useSelectedRoutes();
  return (location.at(-1)?.route || {}) as {
    keepAlive?: boolean; //是否缓存
    keepBackAlive?: boolean; //是否返回的时候还缓存
    customHeader?: boolean; // 自定义头部
  };
};

export default useRoute;
