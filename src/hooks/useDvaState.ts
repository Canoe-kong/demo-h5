import { DvaType } from '@/models';
import { useSelector } from '@umijs/max';

const useDvaState = <T = DvaType>(
  cb: (state: DvaType) => T = (state) => state as T,
) => {
  return useSelector(cb) as T;
};
export default useDvaState;
