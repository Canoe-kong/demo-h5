/**
 * 合伙云api
 */
import { partnerUrlMap } from '../../../../config/env';
const { REACT_APP_ENV = 'dev' } = process.env;

const base_url = partnerUrlMap[REACT_APP_ENV];

const baseApi: Record<string, string> = {
  getUserBaseInfo: '/partner-uaa/userBase/getUserBaseInfo',
};
const partnerApi: typeof baseApi = {};
Object.keys(baseApi).forEach((c) => {
  partnerApi[c] = base_url + baseApi[c];
});

export { partnerApi };
