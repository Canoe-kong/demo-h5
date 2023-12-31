import { NewserveUrlMap, serveUrlMap } from './env';

/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
const { UMI_ENV = 'dev' } = process.env;
const base_url = serveUrlMap[UMI_ENV];
const base_url_new = NewserveUrlMap[UMI_ENV];

export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/lincoln/': {
      // 要代理的地址
      target: base_url,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/market/': {
      // 要代理的地址
      target: base_url_new,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/obama/': {
      // 要代理的地址
      target: base_url,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/oss/': {
      // 要代理的地址
      target: base_url,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/dict/': {
      // 要代理的地址
      target: base_url,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/stalin/': {
      // 要代理的地址
      target: base_url,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
  },
};
