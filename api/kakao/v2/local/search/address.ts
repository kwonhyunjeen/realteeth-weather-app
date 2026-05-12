import { proxyKakao } from '../../../_kakao';

export const GET = (request: Request) => {
  return proxyKakao(request, '/v2/local/search/address.json');
};
