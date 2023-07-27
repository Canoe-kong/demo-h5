import { defineConfig } from '@umijs/max';
export default defineConfig({
  // build 环境的地址
  define: {
    'process.env.REQUEST_BASE_URL': 'https://power-mch.xgd.com',
    'process.env.REQUEST_UPLOAD_URL':
      'https://power-mch.xgd.com/oss/uploadFile',
    REACT_APP_ENV: 'prod',
  },
  outputPath: 'dist/prod/',
  publicPath: '/agent-h5/',
  base: '/agent-h5/',
});
