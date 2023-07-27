/*
 * @Description:处理需要缓存用router
 */
export const keepAliveRouter = (data: any[]) => {
  const pathArr: any[] = [];
  const handleRouter = (_data: any[]) => {
    _data.map((item) => {
      if (item.path && item.keepAlive) {
        if (item.routes) {
          handleRouter(item.routes);
        }
        pathArr.push(item.path);
      }
    });
  };
  handleRouter(data);
  return [...new Set(pathArr)];
};
