// 处理获取app给的token

export function getValueFromUA(key: string) {
  let ans = '';
  const UA = navigator.userAgent.split(' ');
  if (key) {
    for (let i = 0; i < UA.length; i++) {
      let arr = UA[i].split('/');
      if (arr[0] === key) {
        ans = arr[1];
      }
    }
  }
  return ans;
}
export function getTokenFromUA() {
  return getValueFromUA('accessToken');
}
