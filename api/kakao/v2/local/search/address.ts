import { proxyKakao } from '../../../_kakao.js';

export const GET = (request: Request) => {
  return proxyKakao(request, '/v2/local/search/address.json');
};
