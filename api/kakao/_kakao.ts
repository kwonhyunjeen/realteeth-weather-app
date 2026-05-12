const KAKAO_API_BASE_URL = 'https://dapi.kakao.com';

const getKakaoRestApiKey = () => {
  const apiKey = process.env.KAKAO_REST_API_KEY;

  if (!apiKey) {
    throw new Error('KAKAO_REST_API_KEY is not configured.');
  }

  return apiKey;
};

export const proxyKakao = async (request: Request, pathname: string) => {
  const requestUrl = new URL(request.url);
  const url = new URL(pathname, KAKAO_API_BASE_URL);

  for (const [key, value] of requestUrl.searchParams) {
    url.searchParams.append(key, value);
  }

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${getKakaoRestApiKey()}` },
  });

  const headers = new Headers(response.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.delete('transfer-encoding');

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
