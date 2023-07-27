// import { keepAliveRouter } from './src/assets/js/aliveRouter';
import { defineConfig } from '@umijs/max';
import theme from '../src/theme/variables';
import { serveUrlMap } from './env';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV = 'dev', NODE_TYPE, UMI_ENV = 'fat' } = process.env;

const isDev = process.env.NODE_TYPE !== 'prod';
const isProd = process.env.UMI_ENV === 'prod';
const tencentMapKey = 'P6UBZ-PXULQ-IHU5G-GKEYN-EX6RZ-LNFJ5';

export default defineConfig({
  // plugins: ['umi-plugin-cache-route'],
  define: {
    'process.env.T_MAP_KEY': tencentMapKey,
    // 'process.env.T_MAP_URL':
    //   'https://map.qq.com/api/js?v=2.exp&key=' + tencentMapKey,
    'process.env.T_MAP_URL':
      'https://map.qq.com/api/gljs?v=1.exp&key=' + tencentMapKey,
    PROD_API: NODE_TYPE === 'prod' ? serveUrlMap[UMI_ENV] : '', //解决生产环境接口地址不跟前端服务一起的问题
  },
  metas: [
    // 增加安全区域，viewport-fit=cover，不能单纯加，会覆盖，所以这里写的是全部，去掉就是默认的
    {
      content:
        'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover',
      name: 'viewport',
    },
  ],
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  antd: {},
  access: {},
  dva: {},
  model: {},
  initialState: {},
  request: {},
  theme,
  title: '立充',
  // layout: {
  //   title: '@umijs/max',
  // },
  routes,
  alias: {
    // 配置别名，对引用路径进行映射
    assets: '@/assets',
    components: '@/components',
    img: '@/assets/img',
  },
  npmClient: 'yarn',

  extraPostCSSPlugins: [
    require('postcss-px-to-viewport')({
      viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是375
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
      replace: true, //是否直接更换属性值，而不添加备用属性
      exclude: /(\/|\\)(node_modules)(\/|\\)/, //忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
    }),
  ],
  // 打包时移除 console
  extraBabelPlugins: isProd ? ['transform-remove-console'] : [],
});
