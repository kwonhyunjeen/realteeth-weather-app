import { proxyKakao } from '../../../_kakao';

export const GET = (request: Request) => {
  return proxyKakao(request, '/v2/local/geo/coord2regioncode.json');
};
