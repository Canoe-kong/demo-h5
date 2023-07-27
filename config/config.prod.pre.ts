import { defineConfig } from '@umijs/max';

export default defineConfig({
  // dev 环境的地址
  define: {
    'process.env.REQUEST_BASE_URL': 'https://power-mch-pre.xgd.com',
    'process.env.REQUEST_UPLOAD_URL':
      'https://power-mch-pre.xgd.com/oss/uploadFile',
    REACT_APP_ENV: 'pre',
  },
  outputPath: 'dist/pre/',
  publicPath: '/agent-h5/',
  base: '/agent-h5/',
});
