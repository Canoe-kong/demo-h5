import { defineConfig } from '@umijs/max';

export default defineConfig({
  // dev 环境的地址
  define: {
    'process.env.REQUEST_BASE_URL': 'https://power-mch-fat.xgd.com',
    'process.env.REQUEST_UPLOAD_URL':
      'https://power-mch-fat.xgd.com/oss/uploadFile',
    REACT_APP_ENV: 'test',
  },
  outputPath: 'dist/test/',
  publicPath: '/agent-h5/',
  base: '/agent-h5/',
});
