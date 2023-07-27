import fs from 'fs';
import lesstToJs from 'less-vars-to-js';
import path from 'path';

export default lesstToJs(
  fs.readFileSync(path.join(__dirname, '//theme.less'), 'utf-8'),
);
