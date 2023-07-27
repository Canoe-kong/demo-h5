import { auth, partnerApi } from '@/assets/js/api';
import { get, post } from '@/utils/request';
/**
 *
 * @param token true,可以当当前token失效的时候重新refresh后再次调用该接口时accessToken用的是最新的值
 * @returns
 */
export async function getCheckToken(token: string | boolean) {
  console.log('跟后台要最新的token=====', token);
  return get(auth.checkToken, {
    token,
  });
}
// 合伙云获取用户类型
export async function getUserBaseInfo(token: string | boolean) {
  console.log('跟合伙云获取基础信息====', token);
  return post(partnerApi.getUserBaseInfo, {
    token: false,
    customBaseUrl: '',
    headers: {
      client: 'H5',
      PS: 'H5',
      Authorization: 'bearer ' + token,
      PT: +new Date(),
      'Content-Type': 'application/json',
    },
    defaultHandle: false,
    data: {},
  }).then((res) => {
    if (res.code === 0) return res.data;

    throw new Error(res.message);
  });
}
