import { getCheckToken, getUserBaseInfo } from '@/services/auth';
import { cache, getTokenFromUA } from '@/utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from '@umijs/max';
import { ACTION_POP, postMessageToApp } from '@/utils/hybrid';
import { Toast } from 'antd-mobile';
/**
 * 获取立充的token
 * @returns boolean
 */

const useAuth = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); //合伙云的token
  const lcToken = searchParams.get('lcToken'); //立充token
  // undefined:初始化中
  // false:没有登录/权限
  // true:登录
  const [auth, setAuth] = useState<undefined | boolean>();
  useEffect(() => {
    // app 使用的是ua传递token
    let _token = getTokenFromUA() || token;
    const accessToken = cache.get(cache.key.ACCESS_TOKEN);
    const appToken = cache.get(cache.key.APP_TOKEN);
    const partnerInfo = cache.get(cache.key.PARTNER_USERINFO); //合伙云用户信息
    if (lcToken) {
      // 测试用
      setAuth(true);
      cache.set(cache.key.ACCESS_TOKEN, lcToken);
    } else if ((appToken !== _token || !partnerInfo?.type) && _token) {
      // 当获取到的token与我存的不一样，可以重新check了
      cache.set(cache.key.APP_TOKEN, _token);
      // 先请求合伙云的信息，看看当前的用户登录的是什么角色
      getUserBaseInfo(_token)
        .then((res) => {
          console.log(res, 'getUserBaseInfo');
          if (res) {
            cache.set(cache.key.PARTNER_USERINFO, res);
            // 当不一样时，重新验证
            getCheckToken(true)
              .then((res) => {
                setAuth(!!res);
                if (res?.accessToken) {
                  cache.set(cache.key.ACCESS_TOKEN, res.accessToken);
                }
              })
              .catch(() => {
                cache.remove(cache.key.ACCESS_TOKEN);
                cache.remove(cache.key.APP_TOKEN);
                cache.remove(cache.key.PARTNER_USERINFO);
                console.log('登录check失败');
                setTimeout(() => {
                  postMessageToApp(ACTION_POP);
                }, 3000);
              });
          }
        })
        .catch((error) => {
          cache.remove(cache.key.ACCESS_TOKEN);
          cache.remove(cache.key.APP_TOKEN);
          cache.remove(cache.key.PARTNER_USERINFO);
          console.log('合伙云获取失败', error);
          Toast.show({
            icon: 'fail',
            content: error.message,
          });
          setTimeout(() => {
            postMessageToApp(ACTION_POP);
          }, 3000);
        });
    } else if (accessToken) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [token]);
  return auth;
};

export default useAuth;
