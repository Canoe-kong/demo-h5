/* eslint-disable no-param-reassign */
import { auth } from '@/assets/js/api';
import { getCheckToken } from '@/services/auth';
import type {
  AxiosRequestConfig as AxiosRequestConfigX,
  RequestConfig,
} from '@umijs/max';
import { request } from '@umijs/max';
import { Toast } from 'antd-mobile';
import { AxiosRequestHeaders, Method } from 'axios';
import cache from './cache';
import { ACTION_POP, ACTION_REFRESH_TOKEN, postMessageToApp } from './hybrid';

// 与后端约定的响应数据格式
export type PostOptions = {
  loading?: boolean;
  loadingText?: string;

  method?: Method;
  postType?: 'form' | 'text' | 'file' | 'arraybuffer';
  token?: string | boolean; //指定token,为false不需要token，同时默认只能用appToken替换，因为需要处理refreshToken成功后，给option重新赋值，不想太多逻辑
  param?: Record<string, string | number>;
  data?: Record<string, string | number | boolean | any>;
  customBaseUrl?: string; // 可以通过这个来启动mock
  errorHalder?: boolean; // 接口success为false是否透传给使用者，默认false，表示不透传
  defaultHandle?: boolean; // 默认处理，如果不需要，直接返回
} & Partial<AxiosRequestConfig>;
interface AxiosRequestConfig extends AxiosRequestConfigX {
  headers: AxiosRequestHeaders;
}

interface Post {
  <D = any>(url: string, option?: PostOptions): Promise<D>;
}
interface Get {
  <D = any>(url: string, option?: PostOptions): Promise<D>;
}
type RefreshPromiseResult = {
  appToken: string;
  accessToken: string;
  data: any;
};

const postBase: AxiosRequestConfig = {
  // 请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
  url: '/post',
  // 请求方法同上
  method: 'post', // default
  // 请求头信息
  headers: {
    'Content-Type': 'multipart/form-data;charset-utf-8',
    // 'Content-Type': 'application/json;charset=UTF-8'
  },
  // 设置超时时间
  timeout: 500000,
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: true, // default
  // 返回数据类型
  responseType: 'json', // default
};

const postBaseResponseText: AxiosRequestConfig = {
  ...postBase,
  responseType: 'text',
};

const postBaseJsontype: AxiosRequestConfig = {
  ...postBase,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset-utf-8'
    'Content-Type': 'application/json;charset=UTF-8',
  },
};
const postFile: AxiosRequestConfig = {
  ...postBase,
  timeout: 1800000,
  // 请求头信息
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset-utf-8',
    'Content-Type': 'multipart/form-data',
  },
};
const postResArraybuffer: AxiosRequestConfig = {
  ...postBase,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  // 返回数据类型
  responseType: 'arraybuffer',
};
// 当token不合法时不需要再次验证token的链接
export const DIS_CHECK_TOKEN_URLS = [''];
// 当refresh成功后不需要再次请求的url，当前只有checkTOken这个接口，
// 是为了处理refresh里面已经请求过的接口不需要再次请求的情况
export const DIS_REQUEST_AGAIN_URLS = [auth.checkToken];
// 不需要验证token的界面
export const DIS_CHECK_TOKEN_ROUTES = ['/403'];
export const Http_Result = {
  SUCCESS: '000',
  AUTH_INVALID: '003119', //账号授权失败
  AUTH_FREEZE: '005001', //账号被冻结
  USER_DELETE: '003203', //用户不存在
  MERCHANT_FREEZE: '005002', //商户被冻结
  TOKEN_INVALID: '003111', // 立充token失效
  USER_INVALID: '003501', // 合伙云账号不支持立充项目
  ERROR: -1,
  FAIL: -2,
};
const AUTH_ERROR = [
  Http_Result.AUTH_FREEZE,
  Http_Result.AUTH_INVALID,
  Http_Result.USER_DELETE,
  Http_Result.MERCHANT_FREEZE,
  Http_Result.TOKEN_INVALID,
];
// 运行时配置
export const requestConfig: RequestConfig = {
  // 统一的请求设定
  timeout: 20000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        Toast.show({
          icon: 'fail',
          content: '非常抱歉，系统开小差...',
        });
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        Toast.show({
          icon: 'fail',
          content: '非常抱歉，系统开小差...',
        });
      } else {
        // 发送请求时出了点问题
        // message.error('Request error, please retry.');
        Toast.show({
          icon: 'fail',
          content: '请求失败，请重试',
        });
      }
      return error;
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      let url;
      // 拦截请求配置，进行个性化处理。
      if (config?.url.includes('http')) {
        url = config.url;
      } else {
        url = (config?.customBaseUrl ?? PROD_API) + config.url;
      }
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    // (response) => {
    //   //解决数字长精度问题
    //   console.log(response.data);
    //   try {
    //     return JSONBIGINT.parse(response);
    //   } catch (err) {
    //     return response;
    //   }
    // },
  ],
};

export const setURL = (url: string, args: string[] = []) => {
  if (typeof url === 'undefined') {
    throw 'no url!';
  }
  if (!args) return url;
  for (let i = 0; i < args.length; i++) {
    if (url.indexOf('{?}') < 0) {
      break;
    }
    url = url.replace(/\{\?\}/, args[i] + '');
  }
  // 最后是否有/{?}
  if (url.lastIndexOf('/{?}') > -1) {
    url = url.substr(0, url.lastIndexOf('/{?}'));
  }
  return url;
};
// 跟app获取新token，如果app也失效，他会自己跳转到登陆
let refreshPromise: Promise<RefreshPromiseResult> | null = null; // 存在多个接口一起请求，导致refreshToken运行多个，保存promise
let refreshCount = 0; // 刷新次数,超过三次就退出
let lastRefreshTime = 0;
/**
 *
 * @returns Promise<{appToken:string,accessToken:string}>
 */
export const refreshToken = () => {
  if (refreshPromise) {
    return refreshPromise;
  } else
    return (refreshPromise = new Promise<RefreshPromiseResult>(
      (resolve, reject) => {
        const refreshTokenCallback = (res: PostMessageCallbackRes) => {
          if (res?.action === ACTION_REFRESH_TOKEN && res?.params?.result) {
            cache.set(cache.key.APP_TOKEN, res?.params?.result);
            // 拿到accessToken后进行验证获取
            getCheckToken(true)
              .then((data) => {
                if (data?.accessToken) {
                  lastRefreshTime = new Date().getTime();
                  cache.set(cache.key.ACCESS_TOKEN, data.accessToken);
                  resolve({
                    appToken: res?.params?.result,
                    accessToken: data.accessToken,
                    data,
                  });
                } else {
                  reject();
                }
              })
              .catch(() => {
                reject();
              });
          } else {
            reject();
          }
        };
        // 间隔1秒
        const currentTime = new Date().getTime();
        if (lastRefreshTime + 1000 > currentTime) {
          new Promise(() => {
            setTimeout(() => {
              window.refreshTokenCallback = refreshTokenCallback;
              postMessageToApp(ACTION_REFRESH_TOKEN, {
                callback: 'refreshTokenCallback',
              });
            }, 1000);
          });
        } else {
          window.refreshTokenCallback = refreshTokenCallback;
          postMessageToApp(ACTION_REFRESH_TOKEN, {
            callback: 'refreshTokenCallback',
          });
        }

        //  ||
        //   window.refreshTokenCallback({
        //     action: '',
        //     params: {
        //       result: false,
        //     },
        //   }); //不是合伙云app
      },
    ).finally(() => {
      refreshPromise = null;
    }));
};
export const post: Post = (url: string, option: PostOptions = {}) => {
  let {
    loading: hasLoading,
    loadingText = '加载中...',
    postType: _postType,
    param: _param,
    method = 'post',
    errorHalder = false,
    headers = {},
    defaultHandle = true,
    ...others
  } = option;
  if (hasLoading) {
    Toast.show({
      icon: 'loading',
      content: loadingText,
      duration: 0,
    });
  }
  let postType: AxiosRequestConfig = postBaseJsontype;
  if (_postType === 'form') {
    postType = postBase;
  }
  if (_postType === 'text') {
    postType = postBaseResponseText;
  } else if (_postType === 'file') {
    postType = postFile;
  } else if (_postType === 'arraybuffer') {
    postType = postResArraybuffer;
  }
  // 自定义token，默认AppToken
  if (option.token !== false) {
    // token
    postType.headers.accessToken =
      typeof option.token === 'string'
        ? option.token
        : cache.get(
            option.token ? cache.key.APP_TOKEN : cache.key.ACCESS_TOKEN,
          );
  }

  /**
   * 需要带上当前用户的角色
   * type: 用户类型:0合伙人,1服务商,2员工
   * upUserId:员工归属合伙人id
   * userId:用户Id/员工Id
   * 当type为0、1,使用userId，否则使用upUserId
   * groupId:
   */
  // TODO:后面看看需不需要做自动容错处理
  const partnerInfo = cache.get(cache.key.PARTNER_USERINFO); //合伙云用户信息
  if (partnerInfo?.type === '2') {
    postType.headers.groupId = partnerInfo?.upUserId;
  } else if (partnerInfo?.type === '1' || partnerInfo?.type === '0') {
    postType.headers.groupId = partnerInfo?.userId;
  }
  // web端需要的字段
  // OSS_WEB:PC
  // BIZ_MP:商家端小程序
  // BD_MP:app h5
  postType.headers.clientType = 'BD_MP';
  // productType:产品类型：1云电宝，2立充
  postType.headers.productType = '2';
  // postType.headers['Content-Security-Policy'] = 'upgrade-insecure-requests'
  let param: Record<string, string | number | boolean> | FormData = {
    ..._param,
  };

  if (_param) {
    if (_postType === 'form') {
      param = _param;
      param = new FormData();
      // eslint-disable-next-line guard-for-in
      for (let x in _param) {
        param.append(x, `${_param[x]}`);
      }
    }
  }
  return new Promise((resolve, reject) => {
    // console.log(tPostType, param);
    let axiosMethod;
    if (method === 'get') {
      axiosMethod = request(url, {
        method: 'GET',
        params: param,
        headers: { ...postType.headers, ...headers },
        ...others,
      });
    } else {
      axiosMethod = request(url, {
        method,
        param,
        headers: { ...postType.headers, ...headers },
        ...others,
      });
    }
    axiosMethod
      .then((response) => {
        if (hasLoading) {
          Toast.clear();
        }
        //  当不需要后续响应的默认操作，置defaultHandle=false
        if (defaultHandle === false) {
          resolve(response);
          return;
        }
        const { code, msg, success, data } = response;
        if (success) {
          resolve(data);
        } else {
          console.log(
            '接口失败url：',
            url,
            '，结果：',
            response,
            refreshPromise,
            AUTH_ERROR.includes(code) &&
              !DIS_CHECK_TOKEN_ROUTES.includes(window.location.pathname) &&
              !DIS_CHECK_TOKEN_URLS.includes(url),
          );
          // 预处理接口的code
          // token 失效，重新跟app获取accessToken
          if (
            // 这种失败需要重新请求token
            AUTH_ERROR.includes(code) &&
            !DIS_CHECK_TOKEN_ROUTES.includes(window.location.pathname) &&
            !DIS_CHECK_TOKEN_URLS.includes(url) &&
            (!DIS_REQUEST_AGAIN_URLS.includes(url) || !refreshPromise) //当检测的是checktoken失败同时refreshPromise是已经存在的，这个时候
          ) {
            // 如果有运行多个refresh，会返回同一个promise
            refreshToken()
              .then(({ appToken, data }) => {
                console.log('refreshToken结果：', appToken, data);
                // TODO:如果请求参数有使用到app_Token,则修改
                if (option?.data?.lcToken) {
                  option.data.lcToken = appToken;
                }
                if (option?.data?.partnerToken) {
                  option.data.partnerToken = appToken;
                }
                // TODO:参数带上token，标识自定义accessToken，默认用
                if (option?.token === true) {
                  option.token = appToken;
                }
                // 不需要再次请求的接口，当前只有checkToken
                if (DIS_REQUEST_AGAIN_URLS.includes(url)) {
                  resolve(data);
                  return;
                }
                // 重新请求
                return post(url, option)
                  .then((c) => {
                    resolve(c);
                    refreshCount = 0;
                  })
                  .catch(() => {
                    if (refreshCount >= 2) {
                      cache.remove(cache.key.ACCESS_TOKEN);
                      cache.remove(cache.key.APP_TOKEN);
                      postMessageToApp(ACTION_POP); //主动调用app返回
                    } else {
                      refreshCount++;
                      reject(response);
                    } // 如果还有问题，次数+1
                  });
              })
              .catch(() => {
                console.log('refreshToken失败');
                if (refreshCount >= 2) {
                  cache.remove(cache.key.ACCESS_TOKEN);
                  cache.remove(cache.key.APP_TOKEN);
                  setTimeout(() => {
                    postMessageToApp(ACTION_POP);
                  }, 3000);
                  //主动调用app返回
                } else {
                  refreshCount++;
                  reject(response);
                } // 如果还有问题，次数+1
                // Toast.show({
                //   icon: 'fail',
                //   content: msg,
                // });
              });
          } else if (msg && !errorHalder) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            Toast.show({
              icon: 'fail',
              content: msg,
            });
            reject(response);
          } else {
            reject(response);
          }
        }
      })
      .catch((error) => {
        Toast.show({
          icon: 'fail',
          content: '非常抱歉，系统开小差...',
        });
        reject(error || {});
      });
  });
};

export const get: Get = (url, option) => {
  return post(url, { ...option, method: 'get' });
};
