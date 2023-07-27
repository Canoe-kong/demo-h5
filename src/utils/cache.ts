import Cookies from 'js-cookie';
import { decode, encode } from './base64';

export default {
  key: {
    ACCESS_TOKEN: 'ACCESS_TOKEN', //立充token
    APP_TOKEN: 'APP_TOKEN', //合伙云token
    USER_INFO: 'USER_INFO',
    CURRENCY: 'CURRENCY',
    LANGUAGE: 'LANGUAGE',
    NAV_LIST: 'NAV_LIST',
    PERMISSION: 'PERMISSION',
    AUTHMAP: 'AUTHMAP',
    BASE_ADDRESS_LIST: 'BASE_ADDRESS_LIST',
    PARTNER_USERINFO: 'PARTNER_USERINFO',
  },
  set(key: string, value: any, isSession?: boolean) {
    let data = JSON.stringify(value);
    if (process.env.NODE_ENV === 'production') {
      data = encode(data);
    }
    let storage = isSession ? sessionStorage : localStorage;
    storage.setItem(key, data);
  },
  get(key: string, isSession?: boolean) {
    let storage = isSession ? sessionStorage : localStorage;
    let data = storage.getItem(key);
    if (!data) return null;
    if (process.env.NODE_ENV === 'production') {
      data = decode(data);
    }
    return data ? JSON.parse(data) : null;
  },
  remove(key: string, isSession?: boolean) {
    let storage = isSession ? sessionStorage : localStorage;
    storage.removeItem(key);
  },
};

export const cookies = {
  // cookies设置token
  getToken() {
    return Cookies.get('token');
  },
  setToken(val: string | object) {
    Cookies.set('token', val);
  },
};
