import { history } from '@umijs/max';
import { To } from 'history';

// 改造

const _push = history.push;

history.push = (to: To, state?: any) => {
  _push(to, state);
};

export default history;
